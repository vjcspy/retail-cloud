import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {go, routerActions} from "@ngrx/router-store";
import {PosGeneralState} from "../../../R/general/general.state";
import {PosPullActions} from "../../../R/entities/pull.actions";

@Injectable()
export class PosViewRouterEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions) { }
  
  @Effect() whenGoCheckout = this.actions$
                                 .ofType(routerActions.UPDATE_LOCATION)
                                 .filter((action: Action) => action.payload['path'] === '/pos/default/sales/checkout')
                                 .withLatestFrom(this.store$.select('general'))
                                 .map((z) => {
                                   const generalState: PosGeneralState = <any> z[1];
    
                                   if (!!generalState.register['id'] && !!generalState.outlet['id'] && !!generalState.store['id']) {
                                     return {
                                       type: PosPullActions.ACTION_PULL_ENTITIES, payload: {
                                         entitiesCode: [
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
                                         ]
                                       }
                                     };
                                   } else {
                                     return go(['/pos/default/outlet-register']);
                                   }
                                 });
  
  @Effect() whenGoOrders = this.actions$
                               .ofType(routerActions.UPDATE_LOCATION)
                               .filter((action: Action) => action.payload['path'] === '/pos/default/sales/orders')
                               .withLatestFrom(this.store$.select('general'))
                               .map((z) => {
                                 const generalState: PosGeneralState = <any> z[1];
    
                                 if (!!generalState.register['id'] && !!generalState.outlet['id'] && !!generalState.store['id']) {
                                   return {
                                     type: PosPullActions.ACTION_PULL_ENTITIES, payload: {
                                       entitiesCode: [
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
                                       ]
                                     }
                                   };
                                 } else {
                                   return go(['/pos/default/outlet-register']);
                                 }
                               });
  
}
