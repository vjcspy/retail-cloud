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
import {AsyncHelper} from "../../../../code/AsyncHelper";
import {PosSyncState} from "../sync/sync.state";
import {QuoteItemActions} from "./item/item.actions";
import {CustomerDB} from "../../database/xretail/db/customer";
import {PosConfigState} from "../config/config.state";
import {QuoteCustomerService} from "./customer/customer.service";
import {NotifyManager} from "../../../../services/notify-manager";
import {ProgressBarService} from "../../../share/provider/progess-bar";
import {ProductDB} from "../../database/xretail/db/product";
import {OfflineService} from "../../../share/provider/offline";
import {PosGeneralState} from "../general/general.state";
import {PosQuoteState} from "./quote.state";
import {QuoteRefundActions} from "./refund/refund.actions";

@Injectable()
export class PosQuoteEffects {
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private quoteService: PosQuoteService,
              private rootActions: RootActions,
              private quoteActions: PosQuoteActions,
              private notify: NotifyManager,
              private quoteCustomer: QuoteCustomerService,
              private progress: ProgressBarService,
              private offlineService: OfflineService) {}
  
  @Effect() setCustomerToQuote = this.actions$
                                     .ofType(PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE)
                                     .withLatestFrom(this.store$.select('general'))
                                     .withLatestFrom(this.store$.select('entities'),
                                                     ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                     .map(([action, generalState, entitiesState]) => {
                                       const customer                              = (action as Action).payload.customer;
                                       const needResolveBilling                    = (action as Action).payload.needResolveBilling;
                                       const needResolveShipping                   = (action as Action).payload.needResolveShipping;
                                       const customerGroups: List<CustomerGroupDB> = (entitiesState as PosEntitiesState).customerGroup.items;
                                       const customerGroup                         = customerGroups.find((group: CustomerGroupDB) => parseInt(group['id']) === parseInt(customer['customer_group_id'] + ''));
    
                                       if (customerGroup) {
                                         customer.setData('tax_class_id', customerGroup['tax_class_id']);
                                       }
    
                                       this.quoteService.setCustomerToQuote(customer);
    
                                       let {shippingAdd, billingAdd} = this.quoteService.getDefaultAddressOfCustomer(customer, (generalState as PosGeneralState).outlet);
    
                                       return this.quoteActions.setAddressToQuote(shippingAdd, billingAdd, needResolveBilling, needResolveShipping, false);
                                     });
  
  @Effect() selectItemToAdd = this.actions$.ofType(PosQuoteActions.ACTION_SELECT_PRODUCT_TO_ADD)
                                  .withLatestFrom(this.store$.select('sync'))
                                  .withLatestFrom(this.store$.select('quote'), (z, z1) => [...z, z1])
                                  .filter((z: any) => {
                                    if ((z[2] as PosQuoteState).info.isShiftOpening === false) {
                                      this.notify.warning("Please Open Shift");
                                      return false;
                                    }
    
                                    return true;
                                  })
                                  .filter(([action, syncState]) => (syncState as PosSyncState).isSyncing === false)
                                  .map(([action]) => {
                                    const product: Product         = _.clone(action.payload['product']);
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
                                          if (action.payload['showDetail'] === true || !_.isEmpty(product.customizable_options)) {
                                            return {
                                              type: PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS,
                                              payload: {product, buyRequest, currentProcessing: 'ADD_NEW'}
                                            };
                                          }
                                        }
                                        break;
                                      case 'configurable':
                                      case 'bundle':
                                      case 'grouped':
                                        return {
                                          type: PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS,
                                          payload: {product, buyRequest, currentProcessing: 'ADD_NEW'}
                                        };
                                      default:
                                    }
    
                                    return this.quoteActions.addItemBuyRequestToQuote(buyRequest, false, false);
                                  });
  
  @Effect() addItemBuyRequest = this.actions$
                                    .ofType(PosQuoteActions.ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE)
                                    .withLatestFrom(this.store$.select('quote'))
                                    .map(([action, quoteState]) => {
                                      const buyRequest = action['payload']['buyRequest'];
                                      let items        = quoteState['items'];
    
                                      if (buyRequest.getData('super_group')) {
                                        _.forEach(buyRequest.getData('super_group'), async (qty, productId) => {
                                          if (qty !== '' && _.isNumber(parseFloat(qty))) {
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
                                        // when adding split item
                                        if (action.payload['skipCheckExisted'] === true) {
                                          items = items.push(buyRequest);
                                        } else {
                                          let info = this._getItemByBuyRequest(buyRequest, items);
                                          items    = info['items'];
                                          if (info['isMatching'] === false) {
                                            items = items.push(buyRequest);
                                          }
                                        }
                                      }
    
                                      return this.quoteActions.updateQuoteItems(items, true, false);
                                    });
  
  @Effect() checkShiftOpening = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                      '[Router] Update Location'
                                    )
                                    .filter(() => this.offlineService.online === true)
                                    .filter((action: Action) => {
                                      if (action.type === PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS) {
                                        return action.payload['entityCode'] === ShiftDB.getCode();
                                      } else {
                                        return ['/pos/default/sales/checkout',
                                                '/pos/default/sales/shifts'
                                               ].indexOf(action.payload['path']) > -1;
                                      }
                                    })
                                    .withLatestFrom(this.store$.select('general'))
                                    .withLatestFrom(this.store$.select('entities'),
                                                    ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                    .switchMap((z) => {
                                      if ((z[0] as Action).type === PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS) {
                                        const shifts: List<any> = (z[2] as PosEntitiesState).shifts.items;
                                        const shiftOpening      = shifts.filter((s: ShiftDB) => parseInt(s.is_open) === 1);
                                        return Observable.of(this.quoteActions.updateQuoteInfo({isShiftOpening: !!shiftOpening}, false));
                                      } else {
                                        return this.quoteService.checkShiftOpenInSV(<any>z[1])
                                                   .map((data) => {
                                                     return this.quoteActions.updateQuoteInfo({isShiftOpening: !!data['is_open']}, false);
                                                   });
                                      }
                                    }).catch((e) => Observable.of(this.rootActions.error("Check shift failed", e, false)));
  
  @Effect() resolveQuote = this.actions$
                               .ofType(
                                 PosQuoteActions.ACTION_NEED_RESOLVE_QUOTE,
                                 // Sau khi add xong customer và init address
                                 PosQuoteActions.ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER,
                                 // After update quote items
                                 PosQuoteActions.ACTION_UPDATE_QUOTE_ITEMS,
                                 QuoteItemActions.ACTION_REMOVE_ITEM_BUY_REQUEST,
                                 QuoteRefundActions.ACTION_LOAD_CREDITMEMO_SUCCESS,
                                 PosQuoteActions.ACTION_ADD_SHIPPING_AMOUNT,
                                 PosQuoteActions.ACTION_REMOVE_SHIPPING,
                               )
                               .withLatestFrom(this.store$.select('quote'))
                               .withLatestFrom(this.store$.select('config'),
                                               ([action, quoteState], configState) => [action, quoteState, configState])
                               .withLatestFrom(this.store$.select('general'),
                                               ([action, quoteState, configState], generalState) => [action, quoteState, configState, generalState])
                               .switchMap(([action, quoteState, configState, generalState]) => {
                                 const quote: Quote = (quoteState as PosQuoteState).quote;
    
                                 if (quote.getCustomer() && quote.getCustomer().getId()) {
                                   const items: List<DataObject> = (quoteState as PosQuoteState).items;
      
                                   return Observable.fromPromise(this.prepareAddProductToQuote(items))
                                                    .switchMap(() => {
                                                      quote.removeAllAddresses()
                                                           .removeAllItems()
                                                           .setUseDefaultCustomer(false)
                                                           .setShippingAddress((quoteState as PosQuoteState).shippingAdd)
                                                           .setBillingAddress((quoteState as PosQuoteState).billingAdd);
        
                                                      let errorActions = [];
        
                                                      items.forEach((item: DataObject) => {
                                                        try {
                                                          ObjectManager.getInstance()
                                                                       .get<SessionQuote>(SessionQuote.CODE_INSTANCE, SessionQuote)
                                                                       .getSalesCreate()
                                                                       .addProductToQuote(item);
                                                        } catch (e) {
                                                          this.notify.error(e.toString());
                                                          errorActions.push(this.quoteActions.quoteAddItemError(item, false));
                                                        }
                                                      });
        
                                                      quote.setTotalsCollectedFlag(false).collectTotals();
        
                                                      return Observable.from([{type: PosQuoteActions.ACTION_RESOLVE_QUOTE}, ...errorActions]);
                                                    });
                                 } else if (!!(generalState as PosGeneralState).outlet['enable_guest_checkout']) {
                                   let customer = new Customer();
                                   Object.assign(customer, (configState as PosConfigState).setting.customer.getDefaultCustomer());
                                   quote.setUseDefaultCustomer(true);
      
                                   return Observable.of(this.quoteActions.setCustomerToQuote(customer, true, true, false));
                                 } else {
                                   return Observable.of({type: RootActions.ACTION_ERROR, payload: {mess: "Not allow guest checkout"}});
                                 }
                               });
  
  @Effect() reorder = this.actions$
                          .ofType(PosQuoteActions.ACTION_REORDER)
                          .debounceTime(1000)
                          .withLatestFrom(this.store$.select('entities'))
                          .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                          .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                          .switchMap((z) => {
                            const action: Action              = <any>z[0];
                            const configState: PosConfigState = <any>z[2];
    
                            const allItems: List<ProductDB> = (z[1] as PosEntitiesState).products.items;
    
                            // resolve items
                            let items = List.of();
                            _.forEach(action.payload['orderData']['items'], (item) => {
                              let _buyRequest = new DataObject();
                              _buyRequest.addData(item['buy_request']);
                              if (_buyRequest.hasOwnProperty('discount_per_item') || _buyRequest.hasOwnProperty('retail_discount_per_items_percent')) {
                                _buyRequest.setData("discount_per_item", 0);
                                _buyRequest.setData("retail_discount_per_items_percent", 0);
                              }
                              if (_buyRequest.hasOwnProperty('custom_price')) {
                                _buyRequest.setData("custom_price", null);
                              }
                              const product = allItems.find((i) => parseInt(i['id'] + '') === parseInt(_buyRequest.getData('product_id')));
                              if (product) {
                                let p = new Product();
                                p.mapWithParent(product);
                                _buyRequest.setData('product', p);
                                items = items.push(_buyRequest);
                              } else {
                                return Observable.of(this.rootActions.error("we_can't_not_find_product_with_id_" + _buyRequest.getData('product_id')));
                              }
                            });
    
                            let ob = [];
                            if (items.count() > 0) {
                              ob.push(this.quoteActions.updateQuoteItems(items, true, false));
                            }
    
                            // Resolve customer
                            let customer = action.payload['orderData']['customer'];
                            if (parseInt(configState.setting.customer.getDefaultCustomerId()) === parseInt(customer + '')) {
                              let c = new Customer();
                              c.mapWithParent(configState.setting.customer.getDefaultCustomer());
      
                              ob.unshift(this.quoteActions.setCustomerToQuote(c, true, true, false));
      
                              return Observable.from(ob);
                            } else if (configState.posRetailConfig.useCustomerOnlineMode) {
                              this.progress.start();
                              return <any>this.quoteCustomer.getCustomerOnline(customer, <any>z[3])
                                              .switchMap((data) => {
                                                if (_.size(data['items']) > 0) {
                                                  customer = data['items'][0];
                                                  let c    = new Customer();
                                                  c.mapWithParent(customer);
          
                                                  ob.unshift(this.quoteActions.setCustomerToQuote(c, true, true, false));
          
                                                  return Observable.from(ob);
                                                } else {
                                                  return Observable.of(this.rootActions.error("we_can't_not_find_customer_when_reorder"));
                                                }
                                              })
                                              .catch(() => {
                                                return Observable.of(this.rootActions.error("we_can't_not_find_customer_when_reorder"));
                                              })
                                              .finally(() => {
                                                this.progress.done(true);
                                              });
                            } else {
                              if (_.isNumber(customer)) {
                                const customers: List<CustomerDB> = (z[1] as PosEntitiesState).customers.items;
                                customer                          = customers.find((c) => parseInt(c['id'] + '') === parseInt(customer + ''));
                                if (!customer) {
                                  return this.rootActions.error("we_can't_not_find_customer_when_reorder");
                                }
                              }
                              let c = new Customer();
                              c.mapWithParent(customer);
      
                              ob.unshift(this.quoteActions.setCustomerToQuote(c, true, true, false));
      
                              return Observable.from(ob);
                            }
                          });
  
  private _getItemByBuyRequest(buyRequest: DataObject, items: List<DataObject>) {
    let isMatching = false;
    if (buyRequest.getData('is_custom_sales') === true) {
      return {items, isMatching};
    }
    
    if (buyRequest.getData('product').getTypeId() === 'grouped') {
      // Grouped product will be converted before add to cart
      isMatching = true;
      return {items, isMatching};
    }
    
    items = <any>items.map((itemBuyRequest: DataObject) => {
      if (this._representBuyRequest(itemBuyRequest, buyRequest)) {
        isMatching = true;
        itemBuyRequest.setData('product', buyRequest.getData('product'));
        switch (itemBuyRequest.getData('product').getTypeId()) {
          case 'virtual':
          case 'simple':
          case 'configurable':
          case 'bundle':
            itemBuyRequest.setData('qty', parseFloat(itemBuyRequest.getData('qty')) + parseFloat(buyRequest.getData('qty')));
            break;
          // case 'grouped':
          //   _.forEach(itemBuyRequest.getData('super_group'), (associateQty, associateId) => {
          //     if (buyRequest.getData('super_group').hasOwnProperty(associateId) &&
          //         !isNaN(parseFloat(buyRequest.getData('super_group')[associateId]))) {
          //       associateQty                                       = isNaN(parseFloat(associateQty)) ? 0 : parseFloat(associateQty);
          //       itemBuyRequest.getData('super_group')[associateId] =
          //         parseFloat(associateQty) + parseFloat(buyRequest.getData('super_group')[associateId]);
          //     }
          //   });
          // break;
          default:
            throw new GeneralException("Can't get item buyRequest");
        }
      }
      return itemBuyRequest;
    });
    
    return {items, isMatching};
  }
  
  private _representBuyRequest(itemBuyRequest: DataObject, buyRequest: DataObject) {
    if (parseInt(itemBuyRequest.getData('product_id')) !== parseInt(buyRequest.getData('product_id'))) {
      return false;
    }
    
    // check options:
    if (buyRequest.getData('options') || itemBuyRequest.getData('options')) {
      if (!this._compareOptions(buyRequest.getData('options'), itemBuyRequest.getData('options'))) {
        return false;
      }
    }
    // check groups
    if (itemBuyRequest.getData('super_group') || buyRequest.getData('super_group')) {
      return !!(_.isObject(itemBuyRequest.getData('super_group')) && buyRequest.getData('super_group'));
    }
    // check super_attribute
    if (buyRequest.getData('super_attribute') || itemBuyRequest.getData('super_attribute')) {
      if (!this._compareOptions(buyRequest.getData('super_attribute'), itemBuyRequest.getData('super_attribute'))) {
        return false;
      }
    }
    // bundle_option
    if (buyRequest.getData('bundle_option') || itemBuyRequest.getData('bundle_option')) {
      if (!this._compareOptions(buyRequest.getData('bundle_option'), itemBuyRequest.getData('bundle_option'))) {
        return false;
      }
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
      if (!isMatch) {
        return false;
      }
      
      _.forEach(option2, (v, k) => {
        if (!option1.hasOwnProperty(k) || !_.isEqual(option1[k], v)) {
          return isMatch = false;
        }
      });
      
      return isMatch;
    } else {
      return false;
    }
  }
  
  private async prepareAddProductToQuote(items: List<DataObject>) {
    return new Promise((resolve) => {
      AsyncHelper.forEach(items.toArray(), async (buyRequest: DataObject) => {
        switch (buyRequest.getData('product').getTypeId()) {
          case 'virtual':
          case 'simple':
            break;
          case 'configurable':
            const configurableProduct: Product = buyRequest.getData('product');
            
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
      }).then(() => resolve());
    });
  }
}
