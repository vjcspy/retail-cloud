import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {CheckoutProductCategoryActions} from "./category.actions";
import {List} from "immutable";
import {CategoryDB} from "../../../../../../database/xretail/db/category";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {CheckoutProductState} from "../product.state";
import {PosEntitiesActions} from "../../../../../../R/entities/entities.actions";
import * as _ from 'lodash';

@Injectable()
export class CheckoutProductCategoryEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private checkoutProductCategoryActions: CheckoutProductCategoryActions) { }
  
  @Effect() resolveCategory = this.actions$
                                  .ofType(
                                    CheckoutProductCategoryActions.ACTION_SELECT_CATEGORY,
                                    PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                  )
                                  .filter((action) => {
                                    return !!action.payload['entityCode'] ? action.payload['entityCode'] === CategoryDB.getCode() : true;
                                  })
                                  .withLatestFrom(this.store$.select('entities'))
                                  .withLatestFrom(this.store$.select('checkoutProduct'), (z, z1) => [...z, z1])
                                  .map((z) => {
                                    const categories: List<CategoryDB>               = (z[1] as PosEntitiesState).category.items;
                                    const checkoutProductState: CheckoutProductState = <any> z[2];
                                    let categoryList: List<any>                      = List.of();
                                    let categoryBreadcrumb                           = List.of();
                                    if (!checkoutProductState.currentCategory) {
                                      const root = categories.find((c) => parseInt(c['level']) === 1);
                                      if (root) {
                                        return this.checkoutProductCategoryActions.selectCategory(root, false);
                                      }
                                    }
                                    else if (parseInt(checkoutProductState.currentCategory['level']) === 1) {
                                      categoryList = <any>categories.filter((c) => parseInt(c['level']) === 2);
                                    } else if (checkoutProductState.currentCategory && parseInt(checkoutProductState.currentCategory['level']) > 1) {
                                      categoryList = <any>categories.filter((c) => parseInt(c['level']) === (parseInt(checkoutProductState.currentCategory['level']) + 1) && c['parent_id'] === checkoutProductState.currentCategory['id']);
                                    }
    
                                    // find breadcrumb
                                    let listBc = checkoutProductState.currentCategory['path'].split('/');
                                    _.forEach(listBc, (id) => {
                                      let _c = categories.find((c) => parseInt(c['id']) === parseInt(id));
                                      if (_c) {
                                        categoryBreadcrumb = categoryBreadcrumb.push(_c['name']);
                                      }
                                    });
                                    return this.checkoutProductCategoryActions.resolvedCategoryList(categoryList, categoryBreadcrumb, false);
                                  });
  
  @Effect() backCategory = this.actions$
                               .ofType(
                                 CheckoutProductCategoryActions.ACTION_BACK_CATEGORY
                               )
                               .withLatestFrom(this.store$.select('entities'))
                               .withLatestFrom(this.store$.select('checkoutProduct'), (z, z1) => [...z, z1])
                               .filter((z) => {
                                 const checkoutProductState: CheckoutProductState = <any> z[2];
                                 return !!checkoutProductState.currentCategory;
                               })
                               .map((z) => {
                                 const categories: List<CategoryDB>               = (z[1] as PosEntitiesState).category.items;
                                 const checkoutProductState: CheckoutProductState = <any> z[2];
    
                                 const p = categories.find((c) => parseInt(c['id']) === parseInt(checkoutProductState.currentCategory['parent_id']));
                                 console.log(p);
                                 return p;
                               })
                               .filter((parentCate) => !!parentCate)
                               .map((pC) => this.checkoutProductCategoryActions.selectCategory(pC, false));
  
  @Effect() reCalculateHeightCategory = this.actions$
                                            .ofType(
                                              CheckoutProductCategoryActions.ACTION_TOGGLE_CATEGORY,
                                              CheckoutProductCategoryActions.ACTION_RESOLVED_CATEGORY_LIST,
                                            )
                                            .debounceTime(200)
                                            .map(() => {
                                              const totalCategoryHeight = jQuery('#product-category').height();
    
                                              return this.checkoutProductCategoryActions.saveCategoryHeight({totalCategoryHeight: totalCategoryHeight}, false);
                                            });
}
