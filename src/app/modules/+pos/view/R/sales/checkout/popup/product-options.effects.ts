import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {TaxClassDB} from "../../../../../database/xretail/db/tax-class";
import {List} from "immutable";
import {Product} from "../../../../../core/framework/catalog/Model/Product";
import {ProductOptionsActions} from "./product-options.actions";
import {ProductHelper} from "../../../../../core/framework/catalog/Helper/Product";
import * as _ from 'lodash';
import {ProductDB} from "../../../../../database/xretail/db/product";
import {ProductOptionsService} from "./product-options.service";
import {ProductOptionsState} from "./product-options.state";
import {Observable} from "rxjs";
import {PosSyncState} from "../../../../../R/sync/sync.state";

@Injectable()
export class ProductOptionsEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private productOptionsService: ProductOptionsService, private quoteActions: PosQuoteActions) { }
  
  @Effect() retrieveProductDataForPopup = this.actions$.ofType(PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS)
                                              .withLatestFrom(this.store$.select('productOptions'))
                                              .withLatestFrom(this.store$.select('entities'),
                                                              ([action, productOptions], entitiesState) => [action, productOptions, entitiesState])
                                              .map(([action, productOptionsState, entitiesState]) => {
                                                const taxClass: List<TaxClassDB> = entitiesState[TaxClassDB.getCode()]['items'];
                                                const product: Product           = productOptionsState['product'];
                                                product.setTaxClassName(ProductHelper.getProductTaxClass(product.tax_class_id, taxClass));
    
                                                // get Image for child of bundle product
                                                if (product.getTypeId() === 'bundle' && !product.getData('childBundleImages')) {
                                                  let childBundleImages           = {};
                                                  const products: List<ProductDB> = entitiesState[ProductDB.getCode()]['items'];
                                                  const options                   = product.x_options['bundle']['options'];
                                                  _.forEach(options, (option) => {
                                                    const selections = option['selections'];
                                                    _.forEach(selections, (selection) => {
                                                      const childProduct = products.find((p) => parseInt(p.id + '') === parseInt(selection['entity_id'] + ''));
                                                      if (childProduct) {
                                                        childBundleImages[selection['entity_id']] = childProduct['origin_image'];
                                                        
                                                        // add data of product to selection, because need tier_prices data when collect total.
                                                        Object.assign(selection, {...childProduct});
                                                      } else {
                                                        childBundleImages[selection['entity_id']] = 'assets/img/no-image1.png';
                                                      }
                                                    });
                                                  });
      
                                                  product.setData('childBundleImages', childBundleImages);
                                                }
    
                                                // get associate of group product
                                                if (product.getTypeId() === 'grouped' && !product.getData('associatedProducts')) {
                                                  let associatedProducts          = [];
                                                  const products: List<ProductDB> = entitiesState[ProductDB.getCode()]['items'];
                                                  _.forEach(product.x_options['grouped'], (a) => {
                                                    const productAssociate = products.find((p) => parseInt(p.id + '') === parseInt(a['entity_id'] + ''));
                                                    if (productAssociate) {
                                                      associatedProducts.push(productAssociate);
                                                    } else {
                                                      a['id']           = a['entity_id'];
                                                      a['origin_image'] = 'assets/img/no-image1.png';
                                                      let _p            = new Product();
                                                      _p.mapWithParent(a);
                                                      associatedProducts.push(a);
                                                    }
                                                  });
      
                                                  product.setData('associatedProducts', associatedProducts);
                                                }
    
                                                // create select data for each attribute in super_attribute
                                                if (product.getTypeId() === 'configurable' && !product.getData('attributeSelectData')) {
                                                  let attributeSelectData = {};
                                                  _.forEach(product.x_options['configurable']['attributes'], (attribute: Object) => {
                                                    let _selectData = {
                                                      data: [
                                                        {
                                                          value: "",
                                                          label: "Choose an Option",
                                                          disabled: false
                                                        }
                                                      ],
                                                      isMultiSelect: false,
                                                      isDisabled: this.productOptionsService.isDisableAttribute(product, attribute, (productOptionsState as ProductOptionsState).optionData.super_attribute)
                                                    };
        
                                                    _.forEach(attribute['options'], (option: Object) => {
                                                      _selectData.data.push({
                                                                              value: option['id'],
                                                                              label: option['label'],
                                                                              disabled: this.productOptionsService.isDisableOption(product, option, (productOptionsState as ProductOptionsState).optionData.super_attribute)
                                                                            });
                                                    });
        
                                                    attributeSelectData[attribute['id']] = _selectData;
                                                  });
      
                                                  product.setData('attributeSelectData', attributeSelectData);
                                                }
    
                                                return {type: ProductOptionsActions.ACTION_RETRIEVE_PRODUCT_INFORMATION, payload: {product}};
                                              });
  
  @Effect() handleWhenChangeOptionConfigurable = this.actions$.ofType(ProductOptionsActions.ACTION_UPDATE_PRODUCT_OPTION_DATA)
                                                     .filter((action: Action) => {
                                                       return action.payload['optionType'] === 'super_attribute' && !_.isEmpty(action.payload['optionValue']);
                                                     })
                                                     .withLatestFrom(this.store$.select('productOptions'))
                                                     .map(([action, productOptionsState]) => {
                                                       const product: Product = productOptionsState['product'];
                                                       let super_attribute    = {};
    
                                                       // when user select attribute, all attribute standing behind will be remove
                                                       _.forEach(productOptionsState['optionData'].super_attribute, (value, key) => {
                                                         super_attribute[key] = value;
                                                         if (action['payload']['optionValue'][key] === value) {
                                                           return false;
                                                         }
                                                       });
    
                                                       if (product.getTypeId() === 'configurable') {
                                                         let attributeSelectData = {};
                                                         _.forEach(product.x_options['configurable']['attributes'], (attribute: Object) => {
                                                           let _selectData = {
                                                             data: [
                                                               {
                                                                 value: "",
                                                                 label: "Choose an Option",
                                                                 disabled: false
                                                               }
                                                             ],
                                                             isMultiSelect: false,
                                                             isDisabled: this.productOptionsService.isDisableAttribute(product, attribute, super_attribute)
                                                           };
        
                                                           _.forEach(attribute['options'], (option: Object) => {
                                                             option['attribute_id'] = attribute['id'];
                                                             _selectData.data.push({
                                                                                     value: option['id'],
                                                                                     label: option['label'],
                                                                                     disabled: this.productOptionsService.isDisableOption(product, option, super_attribute)
                                                                                   });
                                                           });
        
                                                           attributeSelectData[attribute['id']] = _selectData;
                                                         });
      
                                                         product.setData('attributeSelectData', attributeSelectData);
                                                       }
    
                                                       return {
                                                         type: ProductOptionsActions.ACTION_RE_INIT_SUPER_ATTRIBUTE_SELECT_DATA,
                                                         payload: {product, super_attribute}
                                                       };
                                                     });
  
  @Effect() confirmProductOptions = this.actions$.ofType(ProductOptionsActions.ACTION_CONFIRM_PRODUCT_OPTIONS)
                                        .withLatestFrom(this.store$.select('productOptions'))
                                        .withLatestFrom(this.store$.select('sync'),
                                                        ([action, productOptions], syncState) => [action, productOptions, syncState])
                                        .filter((z) => (z[2] as PosSyncState).isSyncing === false)
                                        .switchMap((z) => {
                                          const productOptionsState: ProductOptionsState = <any>z[1];
    
                                          return Observable.fromPromise(this.productOptionsService.confirmProductOptionsForm())
                                                           .map(() => {
                                                             if (!_.isEmpty(productOptionsState['product'].customizable_options)) {
                                                               productOptionsState.buyRequest.setData('options', {...productOptionsState.optionData.options});
                                                             }
                                                             if (productOptionsState.product.getTypeId() === "configurable") {
                                                               productOptionsState.buyRequest.setData('super_attribute', {...productOptionsState.optionData.super_attribute});
                                                             }
                                                             if (productOptionsState.product.getTypeId() === "grouped") {
                                                               productOptionsState.buyRequest
                                                                                  .setData('super_group', {...productOptionsState.optionData.super_group})
                                                                                  .setData('associatedProducts', productOptionsState.product.getData('associatedProducts'));
                                                             }
                                                             if (productOptionsState.product.getTypeId() === "bundle") {
                                                               productOptionsState.buyRequest
                                                                                  .setData('bundle_option', {...productOptionsState.optionData.bundle_option})
                                                                                  .setData('bundle_option_qty', {...productOptionsState.optionData.bundle_option_qty});
                                                             }
                                                             if (productOptionsState.currentProcessing === 'ADD_NEW') {
                                                               return this.quoteActions.addItemBuyRequestToQuote(productOptionsState.buyRequest, false, false);
                                                             } else {
                                                               return {
                                                                 type: PosQuoteActions.ACTION_NEED_RESOLVE_QUOTE
                                                               };
                                                             }
                                                           });
    
                                        });
}
