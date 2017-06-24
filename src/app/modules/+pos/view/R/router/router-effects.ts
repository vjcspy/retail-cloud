import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {go, routerActions} from "@ngrx/router-store";
import {PosPullActions} from "../../../R/entities/pull.actions";

@Injectable()
export class PosViewRouterEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private pullActions: PosPullActions) { }
  
  @Effect() whenGoCheckout = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => action.payload['path'] === '/pos/default/sales/checkout')
                                 .withLatestFrom(this.store$.select('general'))
                                 .map((z) => {
                                   return this.pullActions.pullEntities([
                                                                          'retailConfig',
                                                                          'settings',
                                                                          'countries',
                                                                          'taxClass',
                                                                          'taxes',
                                                                          'receipts',
                                                                          'payment',
                                                                          'userOrderCount',
                                                                          // 'warehouse',
                                                                          // 'permission',
                                                                          'customerGroup',
                                                                          'customers',
                                                                          // 'category',
                                                                          'products'
                                                                        ], false);
                                 });
  
  @Effect() whenGoOrders = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) => action.payload['path'] === '/pos/default/sales/orders')
                               .withLatestFrom(this.store$.select('general'))
                               .map((z) => {
                                 return this.pullActions.pullEntities([
                                                                        'retailConfig',
                                                                        'settings',
                                                                        'countries',
                                                                        // 'taxClass',
                                                                        // 'taxes',
                                                                        'receipts',
                                                                        'payment',
                                                                        'orders',
                                                                        // 'userOrderCount',
                                                                        // 'warehouse',
                                                                        // 'permission',
                                                                        // 'customerGroup',
                                                                        // 'customers',
                                                                        // 'category',
                                                                        // 'products'
                                                                      ], false);
                               });
  
}
