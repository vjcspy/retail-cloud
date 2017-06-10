import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {TaxClassDB} from "../../../../../database/xretail/db/tax-class";
import {List} from "immutable";
import {Product} from "../../../../../core/framework/catalog/Model/Product";
import {ProductOptionsActions} from "./product-options.actions";
import {ProductHelper} from "../../../../../core/framework/catalog/Helper/Product";
import * as _ from 'lodash';
import {ProductDB} from "../../../../../database/xretail/db/product";

@Injectable()
export class ProductOptionsEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions) { }
  
  @Effect() retrieveProductDataForPopup = this.actions$.ofType(PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS)
                                              .withLatestFrom(this.store$.select('productOptions'))
                                              .withLatestFrom(this.store$.select('entities'),
                                                              ([action, productOptions], entitiesState) => [action, productOptions, entitiesState])
                                              .map(([action, productOptionsState, entitiesState]) => {
                                                const taxClass: List<TaxClassDB> = entitiesState[TaxClassDB.getCode()]['items'];
                                                const product: Product           = productOptionsState['product'];
                                                product.setTaxClassName(ProductHelper.getProductTaxClass(product.tax_class_id, taxClass));
    
                                                // get Image for child of bundle product
                                                if (product.getTypeId() === 'bundle') {
                                                  let childBundleImages           = {};
                                                  const products: List<ProductDB> = entitiesState[ProductDB.getCode()]['items'];
                                                  const options                   = product.x_options['bundle']['options'];
                                                  _.forEach(options, (option) => {
                                                    const selections = option['selections'];
                                                    _.forEach(selections, (selection) => {
                                                      const childProduct = products.find((p) => parseInt(p.id + '') === parseInt(selection['entity_id'] + ''));
                                                      if (childProduct) {
                                                        childBundleImages[selection['entity_id']] = childProduct['origin_image'];
                                                      } else {
                                                        childBundleImages[selection['entity_id']] = 'assets/img/no-image1.png';
                                                      }
                                                    });
                                                  });
      
                                                  product.setData('childBundleImages', childBundleImages);
                                                }
    
                                                // get associate of group product
                                                if (product.getTypeId() === 'grouped') {
                                                  let associatedProducts          = [];
                                                  const products: List<ProductDB> = entitiesState[ProductDB.getCode()]['items'];
                                                  _.forEach(product.x_options['grouped'], (a) => {
                                                    const productAssociate = products.find((p) => parseInt(p.id + '') === parseInt(a['entity_id'] + ''));
                                                    if (productAssociate) {
                                                      associatedProducts.push(productAssociate);
                                                    }
                                                  });
      
                                                  product.setData('associatedProducts', associatedProducts);
                                                }
    
                                                return {type: ProductOptionsActions.ACTION_RETRIEVE_PRODUCT_INFORMATION, payload: {product}}
    
                                              })
}
