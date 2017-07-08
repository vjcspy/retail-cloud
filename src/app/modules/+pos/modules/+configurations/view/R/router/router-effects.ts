import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {routerActions} from "@ngrx/router-store";
import {PosPullActions} from "../../../../../R/entities/pull.actions";

@Injectable()
export class ConfigurationsViewRouterEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private pullActions: PosPullActions) { }
  
  @Effect() whenGoCheckout = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => action.payload['path'] === '/pos/configurations/default/pos/product-category')
                                 .map(() => {
                                   return this.pullActions.pullEntities([
                                                                          'retailConfig',
                                                                          // 'settings',
                                                                          // 'countries',
                                                                          'taxClass',
                                                                          // 'taxes',
                                                                          // 'receipts',
                                                                          // 'payment',
                                                                          // 'userOrderCount',
                                                                          // 'warehouse',
                                                                          // 'permission',
                                                                          // 'customerGroup',
                                                                          // 'customers',
                                                                          // 'category',
                                                                          // 'products',
                                                                          // 'orders',
                                                                        ], false);
                                 });
}
