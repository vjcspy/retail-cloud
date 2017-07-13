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
import {PosConfigState} from "../../../../../../R/config/config.state";
import {Router} from "@angular/router";

@Injectable()
export class CheckoutProductCategoryEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private checkoutProductCategoryActions: CheckoutProductCategoryActions) { }
  
  @Effect() resolveCategory = this.actions$
                                  .ofType(
                                    CheckoutProductCategoryActions.ACTION_SELECT_CATEGORY,
                                    PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                  )
                                  .filter((action) => {
                                    return !!action.payload['entityCode'] ? action.payload['entityCode'] === CategoryDB.getCode() : true;
                                  })
                                  .filter(() => this.router.isActive('/pos/default/sales/checkout', false))
                                  .withLatestFrom(this.store$.select('entities'))
                                  .withLatestFrom(this.store$.select('checkoutProduct'), (z, z1) => [...z, z1])
                                  .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
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
                                    } else if (parseInt(checkoutProductState.currentCategory['level']) === 1) {
                                      categoryList = <any>categories.filter((c) => parseInt(c['level']) === 2);
                                    } else if (checkoutProductState.currentCategory && parseInt(checkoutProductState.currentCategory['level']) > 1) {
                                      categoryList = <any>categories.filter((c) => parseInt(c['level']) === (parseInt(checkoutProductState.currentCategory['level']) + 1) && c['parent_id'] === checkoutProductState.currentCategory['id']);
                                    }
    
                                    // sort category list
                                    const configState = (z[3] as PosConfigState);
                                    categoryList      = <any>categoryList.sortBy((c) => {
                                      if (configState.posRetailConfig.sortCategoryBaseOn === 'name') {
                                        return _.toLower(c[configState.posRetailConfig.sortCategoryBaseOn]);
                                      } else {
                                        return parseInt(c[configState.posRetailConfig.sortCategoryBaseOn]);
                                      }
                                    });
                                    if (configState.posRetailConfig.sortCategorySorting !== 'asc') {
                                      categoryList = <any>categoryList.reverse();
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
    
                                 return categories.find((c) => parseInt(c['id']) === parseInt(checkoutProductState.currentCategory['parent_id']));
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
