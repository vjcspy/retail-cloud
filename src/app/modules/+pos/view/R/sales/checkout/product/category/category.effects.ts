import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {CheckoutProductCategoryActions} from "./category.actions";
import {List} from "immutable";
import {CategoryDB} from "../../../../../../database/xretail/db/category";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {CheckoutProductState} from "../product.state";
import {PosEntitiesActions} from "../../../../../../R/entities/entities.actions";

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
    
                                    if (!checkoutProductState.currentCategory || parseInt(checkoutProductState.currentCategory['level']) === 1) {
                                      categoryList = <any>categories.filter((c) => parseInt(c['level']) === 2);
                                    } else if (checkoutProductState.currentCategory && parseInt(checkoutProductState.currentCategory['level']) > 1) {
                                      categoryList = <any>categories.filter((c) => (parseInt(c['level']) === (parseInt(categories['level']) + 1)) && c['parent_id'] === categories['id']);
                                    }
    
                                    return this.checkoutProductCategoryActions.resolvedCategoryList(categoryList, false);
                                  });
  
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
