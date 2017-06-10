import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosQuoteActions} from "./quote.actions";
import {PosEntitiesState} from "../entities/entities.state";
import {CustomerGroupDB} from "../../database/xretail/db/customer-group";
import {List} from "immutable";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {PosQuoteService} from "./quote.service";
import {PosEntitiesActions} from "../entities/entities.actions";
import {ShiftDB} from "../../database/xretail/db/shift";
import {Observable} from "rxjs";
import {RootActions} from "../../../../R/root.actions";
import {Quote} from "../../core/framework/quote/Model/Quote";
import {Product} from "../../core/framework/catalog/Model/Product";
import {DataObject} from "../../core/framework/General/DataObject";
import * as _ from 'lodash';
import {GeneralException} from "../../core/framework/General/Exception/GeneralException";
import {Configurable} from "../../core/framework/configurable-product/Model/Product/Type/Configurable";
import {Bundle} from "../../core/framework/bundle/Model/Product/Type";
import {Grouped} from "../../core/framework/grouped-product/Model/Product/Type/Grouped";
import {ObjectManager} from "../../core/framework/General/App/ObjectManager";
import {SessionQuote} from "../../core/framework/Backend/Model/Session/Quote";

@Injectable()
export class PosQuoteEffects {
  constructor(private store$: Store<any>, private actions$: Actions, private quoteService: PosQuoteService) {}
  
  @Effect() setCustomerToQuote = this.actions$
                                     .ofType(PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE)
                                     .withLatestFrom(this.store$.select('general'))
                                     .withLatestFrom(this.store$.select('entities'),
                                                     ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                     .map(([action, generalState, entitiesState]) => {
                                       const customer                              = action.payload.customer;
                                       const customerGroups: List<CustomerGroupDB> = entitiesState.customerGroup.items;
                                       const customerGroup                         = customerGroups.find((group: CustomerGroupDB) => parseInt(group['id']) === parseInt(customer['customer_group_id'] + ''));
    
                                       if (customerGroup) {
                                         customer.setData('tax_class_id', customerGroup['tax_class_id']);
                                       }
    
                                       this.quoteService.setCustomerToQuote(customer);
    
                                       return {
                                         type: PosQuoteActions.ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS,
                                         payload: this.quoteService.getDefaultAddressOfCustomer(customer, generalState)
                                       }
                                     });
  
  @Effect() selectItemToAdd = this.actions$.ofType(PosQuoteActions.ACTION_SELECT_PRODUCT_TO_ADD)
                                  .withLatestFrom(this.store$.select('quote'))
                                  .map(([action, quoteState]) => {
                                    const product: Product         = action.payload['product'];
                                    const forceProductCustomOption = action.payload['forceProductCustomOptions'];
                                    let buyRequest                 = new DataObject();
    
                                    if (!!action.payload['config']) {
                                      buyRequest.addData(action.payload['config']);
                                    }
                                    buyRequest.setData('qty', action.payload['qty'])
                                              .setData('product_id', product.getData('id'))
                                              .setData('product', product);
    
                                    switch (product.getTypeId()) {
                                      case 'virtual':
                                      case 'simple':
                                        if (!forceProductCustomOption) {
                                          // custom option
                                          if (!_.isEmpty(product.customizable_options)) {
                                            return {type: PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS, payload: {product, buyRequest}};
                                          }
                                        }
                                        break;
                                      case 'configurable':
                                      case 'bundle':
                                      case 'grouped':
                                        return {type: PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS, payload: {product, buyRequest}};
                                    }
    
                                    return {type: PosQuoteActions.ACTION_ADD_PRODUCT_TO_QUOTE, payload: {buyRequest}}
                                  });
  
  @Effect() addToQuote = this.actions$.ofType(PosQuoteActions.ACTION_ADD_PRODUCT_TO_QUOTE)
                             .withLatestFrom(this.store$.select('quote'))
                             .map(([action, quoteState]) => {
                               const buyRequest = action['payload']['buyRequest'];
                               let items        = quoteState['items'];
                               if (buyRequest.getData('super_group')) {
                                 _.forEach(buyRequest.getData('super_group'), async (qty, productId) => {
                                   if (qty != '' && _.isNumber(parseFloat(qty))) {
                                     let _p = _.find(buyRequest.getData('associatedProducts'), (pr) => parseInt(pr['id'] + '') === parseInt(productId + ''));
                                     if (!!_p) {
                                       let childProduct = new Product();
                                       childProduct.mapWithParent(_p);
                                       let childBuyRequest = new DataObject();
                                       childBuyRequest.setData('qty', qty)
                                                      .setData('product_id', productId)
                                                      .setData('product', childProduct);
            
                                       let info = this._getItemByBuyRequest(childBuyRequest, items);
                                       items    = info['items'];
                                       if (info['isMatching'] === false) {
                                         items = items.push(childBuyRequest);
                                       }
                                     }
                                   }
                                 });
                               } else {
                                 let info = this._getItemByBuyRequest(buyRequest, items);
                                 items    = info['items'];
                                 if (info['isMatching'] === false) {
                                   items = items.push(buyRequest);
                                 }
                               }
    
                               return {type: PosQuoteActions.ACTION_UPDATE_QUOTE_ITEMS, payload: {items}};
                             });
  
  @Effect() checkShiftOpening = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                      '[Router] Update Location'
                                    )
                                    .filter((action: Action) => {
                                      if (action.type === PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS) {
                                        return action.payload['entityCode'] === ShiftDB.getCode();
                                      } else {
                                        return true;
                                      }
                                    })
                                    .withLatestFrom(this.store$.select('general'))
                                    .withLatestFrom(this.store$.select('entities'),
                                                    ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                    .switchMap((z) => {
                                      const shifts: List<any> = (z[2] as PosEntitiesState).shifts.items;
                                      const shiftOpening      = shifts.filter((s: ShiftDB) => parseInt(s.is_open) === 1);
                                      if (z[0].type == PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS || !!shiftOpening) {
                                        return Observable.of({
                                                               type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO,
                                                               payload: {isShiftOpening: !!shiftOpening}
                                                             });
                                      } else {
                                        return this.quoteService.checkShiftOpenInSV(z[1])
                                                   .map((data) => {
                                                     return {
                                                       type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO,
                                                       payload: {isShiftOpening: !!data['is_open']}
                                                     };
                                                   });
                                      }
                                    }).catch((e) => Observable.of({type: RootActions.ACTION_ERROR, payload: {e}}));
  
  @Effect() resolveQuote = this.actions$
                               .ofType(
                                 // Sau khi add xong customer và init address
                                 PosQuoteActions.ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS,
                                 // After update quote items
                                 PosQuoteActions.ACTION_UPDATE_QUOTE_ITEMS
                               )
                               .withLatestFrom(this.store$.select('quote'))
                               .withLatestFrom(this.store$.select('config'),
                                               ([action, quoteState], configState) => [action, quoteState, configState])
                               .withLatestFrom(this.store$.select('general'),
                                               ([action, quoteState, configState], generalState) => [action, quoteState, configState, generalState])
                               .switchMap(([action, quoteState, configState, generalState]) => {
                                 const quote: Quote = quoteState.quote;
    
                                 quote.removeAllAddresses();
    
                                 if (quote.getCustomer() && quote.getCustomer().getId()) {
                                   quote.setData('use_default_customer', false);
                                   quote.setShippingAddress(quoteState.shippingAdd);
                                   quote.setBillingAddress(quoteState.billingAdd);
      
                                   quote.removeAllItems();
      
                                   const items: List<DataObject> = quoteState.items;
      
                                   return Observable.fromPromise(this.prepareAddProductToQuote(items))
                                                    .map(() => {
                                                      items.forEach((item: DataObject) => {
                                                        ObjectManager.getInstance()
                                                                     .get<SessionQuote>(SessionQuote.CODE_INSTANCE, SessionQuote)
                                                                     .getSalesCreate()
                                                                     .addProductToQuote(item);
                                                      });
        
                                                      quote.setTotalsCollectedFlag(false).collectTotals();
        
                                                      return {type: PosQuoteActions.ACTION_RESOLVE_QUOTE};
                                                    });
                                 } else if (!!generalState.outlet['enable_guest_checkout']) {
                                   let customer = new Customer();
                                   Object.assign(customer, configState.setting.customer.getDefaultCustomer());
                                   quote.setData('use_default_customer', true);
      
                                   return Observable.of({type: PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE, payload: {customer}});
                                 } else {
                                   return Observable.of({type: RootActions.ACTION_ERROR, payload: {mess: "Not allow guest checkout"}});
                                 }
                               });
  
  
  private _getItemByBuyRequest(buyRequest: DataObject, items: List<DataObject>) {
    let isMatching = false;
    if (buyRequest.getData('is_custom_sales') === true)
      return {items, isMatching};
    
    if (buyRequest.getData('product').getTypeId() === 'grouped') {
      // Tất cả grouped đều chuyển thành simple nên không bao h tồn tại group trong cart
      isMatching = true;
      return {items, isMatching};
    }
    
    items = <any>items.map((itemBuyRequest: DataObject) => {
      if (this._representBuyRequest(itemBuyRequest, buyRequest)) {
        isMatching = true;
        // Sau khi apply sync thì sẽ mất product trong items.
        if (!itemBuyRequest.getData('product')) {
          itemBuyRequest.setData('product', buyRequest.getData('product'));
        }
        switch (itemBuyRequest.getData('product').getTypeId()) {
          case 'virtual':
          case 'simple':
          case 'configurable':
            itemBuyRequest.setData('qty', parseFloat(itemBuyRequest.getData('qty')) + parseFloat(buyRequest.getData('qty')));
            break;
          case 'grouped':
            _.forEach(itemBuyRequest.getData('super_group'), (associateQty, associateId) => {
              if (buyRequest.getData('super_group').hasOwnProperty(associateId) &&
                  !isNaN(parseFloat(buyRequest.getData('super_group')[associateId]))) {
                associateQty                                       = isNaN(parseFloat(associateQty)) ? 0 : parseFloat(associateQty);
                itemBuyRequest.getData('super_group')[associateId] =
                  parseFloat(associateQty) + parseFloat(buyRequest.getData('super_group')[associateId]);
              }
            });
            break;
          case 'bundle':
            itemBuyRequest.setData('qty', itemBuyRequest.getData('qty') + buyRequest.getData('qty'));
            break;
          default:
            throw new GeneralException("Can't get item buyRequest");
        }
      }
      return itemBuyRequest;
    });
    
    return {items, isMatching};
  }
  
  private _representBuyRequest(itemBuyRequest: DataObject, buyRequest: DataObject) {
    if (itemBuyRequest.getData('product_id') != buyRequest.getData('product_id'))
      return false;
    
    // check options:
    if (buyRequest.getData('options') || itemBuyRequest.getData('options')) {
      if (!this._compareOptions(buyRequest.getData('options'), itemBuyRequest.getData('options')))
        return false;
    }
    // check groups
    if (itemBuyRequest.getData('super_group') || buyRequest.getData('super_group')) {
      return !!(_.isObject(itemBuyRequest.getData('super_group')) && buyRequest.getData('super_group'));
    }
    // check super_attribute
    if (buyRequest.getData('super_attribute') || itemBuyRequest.getData('super_attribute')) {
      if (!this._compareOptions(buyRequest.getData('super_attribute'), itemBuyRequest.getData('super_attribute')))
        return false;
    }
    // bundle_option
    if (buyRequest.getData('bundle_option') || itemBuyRequest.getData('bundle_option')) {
      if (!this._compareOptions(buyRequest.getData('bundle_option'), itemBuyRequest.getData('bundle_option')))
        return false;
    }
    return true;
  }
  
  
  private _compareOptions(option1: Object, option2: Object) {
    if (_.isObject(option1) && _.isObject(option2)) {
      let isMatch = true;
      _.forEach(option1, (v, k) => {
        if (!option2.hasOwnProperty(k) || !_.isEqual(option2[k], v)) {
          return isMatch = false;
        }
      });
      if (!isMatch)
        return false;
      _.forEach(option2, (v, k) => {
        if (!option1.hasOwnProperty(k) || !_.isEqual(option1[k], v)) {
          return isMatch = false;
        }
      });
      
      return isMatch;
    } else
      return false;
  }
  
  private async prepareAddProductToQuote(items: List<DataObject>) {
    return new Promise((resolve, reject) => {
      let work = 0;
      let size = items.count();
      if (size == 0) {
        setTimeout(() => {
          return resolve();
        }, 0);
      } else {
        items.forEach(async (buyRequest: DataObject) => {
          // NEEDCHECK: Ensure product are fresh. In case change buy request maybe use old product with price is calculated
          // let _p = new Product();
          // if (!buyRequest.getData('product')) {
          //   await _p.getById(buyRequest.getData('product_id'));
          // }
          // _p.mapWithParent(buyRequest.getData('product'));
          //
          // buyRequest.unsetData('product')
          //           .setData('product', _p);
          
          switch (buyRequest.getData('product').getTypeId()) {
            case 'virtual':
            case 'simple':
              break;
            case 'configurable':
              let configurableProduct: Product;
              configurableProduct = buyRequest.getData('product');
              
              let configurableType = new Configurable();
              await configurableType.resolveConfigurable(buyRequest, configurableProduct);
              break;
            case 'bundle':
              let bundleProduct: Product;
              bundleProduct = buyRequest.getData('product');
              
              let bundleType;
              bundleType = <Bundle>bundleProduct.getTypeInstance();
              bundleType.resolveBundle(buyRequest, bundleProduct);
              
              break;
            case 'grouped':
              let groupedProduct: Product;
              groupedProduct = buyRequest.getData('product');
              
              let groupedType = <Grouped> groupedProduct.getTypeInstance();
              await groupedType.resolveAssociatedProducts(groupedProduct);
              break;
            default:
              throw new GeneralException("We not yet support type of this product.");
          }
          if (++work >= size) {
            return resolve();
          }
        });
      }
    });
  }
}
