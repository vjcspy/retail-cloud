import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {routerActions} from "@ngrx/router-store";
import {PosPullActions} from "../../../../../R/entities/pull.actions";
import {Router} from "@angular/router";

@Injectable()
export class ConfigurationsViewRouterEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private pullActions: PosPullActions) { }
  
  @Effect() whenGoProductCategory = this.actions$
                                        .ofType(routerActions.UPDATE_LOCATION)
                                        .filter((action: Action) => action.payload['path'] === '/pos/configurations/default/pos/product-category')
                                        .map(() => {
                                          return this.pullActions.pullEntities([
                                                                                 'retailConfig',
                                                                                 'settings',
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
  
  @Effect() whenGoCustomer = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => action.payload['path'] === '/pos/configurations/default/pos/customer')
                                 .map(() => {
                                   return this.pullActions.pullEntities([
                                                                          'retailConfig',
                                                                          // 'settings',
                                                                          'countries',
                                                                          // 'taxClass',
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
  
  @Effect() whenGoOutlet = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/outlet', false))
                               .map(() => {
                                 return this.pullActions.pullEntities([
                                                                        // 'retailConfig',
                                                                        'outlet',
                                                                        'countries',
                                                                        'stores',
                                                                        // 'taxes',
                                                                        'receipts',
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
  
  @Effect() whenGoPayment = this.actions$
                                .ofType(routerActions.UPDATE_LOCATION)
                                .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/payment', false))
                                .map(() => {
                                  return this.pullActions.pullEntities([
                                                                         // 'retailConfig',
                                                                         // 'outlet',
                                                                         // 'countries',
                                                                         // 'stores',
                                                                         // 'taxes',
                                                                         // 'receipts',
                                                                         'payment',
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
