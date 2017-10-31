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
                                                                                 // 'settings',
                                                                                 'taxClass',
                                                                               ], false);
                                        });
  
  @Effect() whenGoCustomer = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => action.payload['path'] === '/pos/configurations/default/pos/customer')
                                 .map(() => {
                                   return this.pullActions.pullEntities([
                                                                          'retailConfig',
                                                                          'countries',
                                                                        ], false);
                                 });
  
  @Effect() whenGoOutlet = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/outlet', false))
                               .map(() => {
                                 return this.pullActions.pullEntities([
                                                                        'outlet',
                                                                        'countries',
                                                                        'stores',
                                                                        'receipts',
                                                                      ], false);
                               });
  
  @Effect() whenGoPayment = this.actions$
                                .ofType(routerActions.UPDATE_LOCATION)
                                .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/payment', false))
                                .map(() => {
                                  return this.pullActions.pullEntities([
                                                                         'payment',
                                                                       ], false);
                                });
  
  @Effect() whenGoCheckout = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/checkout', false))
                                 .map(() => {
                                   return this.pullActions.pullEntities([
                                                                          'retailConfig',
                                                                        ], false);
                                 });
  
  @Effect() whenGoIntegration = this.actions$
                                    .ofType(routerActions.UPDATE_LOCATION)
                                    .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/integration', false))
                                    .map(() => {
                                      return this.pullActions.pullEntities([
                                                                             'retailConfig',
                                                                           ], false);
                                    });
  
  @Effect() whenGoReceipt = this.actions$
                                .ofType(routerActions.UPDATE_LOCATION)
                                .filter((action: Action) => this.router.isActive('pos/configurations/default/pos/receipt', false))
                                .map(() => {
                                  return this.pullActions.pullEntities([
                                                                         'receipts'
                                                                       ], false);
                                });
  
  @Effect() whenGoPullPerformance = this.actions$
                                        .ofType(routerActions.UPDATE_LOCATION)
                                        .filter((action: Action) => this.router.isActive('pos/configurations/default/advanced/pull-performance', false))
                                        .map(() => {
                                          return this.pullActions.pullEntities([
                                                                                 'stores'
                                                                               ], false);
                                        });
  
  @Effect() whenGoRegion = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) =>this.router.isActive('pos/configurations/default/pos/region' , false))
                               .map(() => {
                                 return this.pullActions.pullEntities([
                                                                        'region',
                                                                        'outlet',
                                                                      ], false);
                               });
}

