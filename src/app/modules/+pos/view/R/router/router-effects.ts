import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {routerActions} from "@ngrx/router-store";
import {PosPullActions} from "../../../R/entities/pull.actions";
import {PosConfigState} from "../../../R/config/config.state";

@Injectable()
export class PosViewRouterEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private pullActions: PosPullActions) { }
  
  @Effect() whenGoCheckout = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => action.payload['path'] === '/pos/default/sales/checkout')
                                 .withLatestFrom(this.store$.select('config'))
                                 .map((z: any) => {
                                   const configState: PosConfigState = z[1];
                                   let entityPull                    = [
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
                                     'category',
                                     'products',
                                     'orders',
                                   ];
                                   if (!configState.posRetailConfig.useCustomerOnlineMode) {
                                     entityPull.push('customers');
                                   }
                                   return this.pullActions.pullEntities(entityPull, false);
                                 });
  
  @Effect() whenGoOrders = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) => action.payload['path'] === '/pos/default/sales/orders')
                               .map(() => {
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
  
  @Effect() whenGoShifts = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) => action.payload['path'] === '/pos/default/sales/shifts')
                               .map(() => {
                                 return this.pullActions.pullEntities([
                                                                        // 'retailConfig',
                                                                        // 'shifts',
                                                                        // 'settings',
                                                                        // 'countries',
                                                                        // 'taxClass',
                                                                        // 'taxes',
                                                                        // 'receipts',
                                                                        'payment',
                                                                        // 'orders',
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
