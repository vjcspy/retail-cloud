import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../entities/entities.actions";
import {List} from "immutable";
import {RootActions} from "../../../../R/root.actions";
import {PosConfigActions} from "./config.actions";
import {UserOrderCountDB} from "../../database/xretail/db/user-order-count";
import {PosGeneralState} from "../general/general.state";
import {Observable} from "rxjs";
import {PosConfigService} from "./config.service";
import {ReceiptDB} from "../../database/xretail/db/receipt";
import {PosEntitiesState} from "../entities/entities.state";
import {PosStepActions} from "../../view/R/sales/checkout/step/step.actions";
import {PosConfigState} from "./config.state";

@Injectable()
export class PosConfigEffects {
  
  constructor(private store$: Store<any>,
              private actions: Actions,
              private configService: PosConfigService,
              private configActions: PosConfigActions,
              private rootActions: RootActions) { }
  
  @Effect() retrieveOrderCount = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                     .filter((action: Action) => action.payload['entityCode'] === UserOrderCountDB.getCode())
                                     .withLatestFrom(this.store$.select('entities'))
                                     .withLatestFrom(this.store$.select('general'),
                                                     ([action, entitiesState], generalState) => [action, entitiesState, generalState])
                                     .flatMap(([action, entitiesState, generalState]) => {
                                       const orderCounts: List<UserOrderCountDB> = entitiesState[UserOrderCountDB.getCode()].items;
    
                                       const orderCount = orderCounts.find((o: UserOrderCountDB) => o.register_id === (generalState as PosGeneralState).register['id']);
    
                                       if (!orderCount) {
                                         return Observable.fromPromise(this.configService.createNewOrderCount(<any>generalState))
                                                          .map((_count) => {
                                                            return this.configActions.retrieveOrderCount(_count, false);
                                                          })
                                                          .catch(() => Observable.of(this.rootActions.error("Can't not create order offline count", null, false)));
                                       }
                                       return Observable.of(this.configActions.retrieveOrderCount(orderCount, false));
                                     });
  
  @Effect() increaseOrderCount = this.actions.ofType(PosStepActions.ACTION_SAVED_ORDER)
                                     .withLatestFrom(this.store$.select('config'))
                                     .withLatestFrom(this.store$.select('general'),
                                                     ([action, entitiesState], generalState) => [action, entitiesState, generalState])
                                     .flatMap(([action, configState, generalState]) => {
                                       const orderCount  = (configState as PosConfigState).orderCount;
                                       let newOrderCount = Object.assign({}, {...orderCount}, {order_count: parseInt(orderCount['order_count']) + 1});
    
                                       return Observable.fromPromise(this.configService.createNewOrderCount(<any>generalState, newOrderCount))
                                                        .map((_count) => {
                                                          return this.configActions.retrieveOrderCount(_count, false);
                                                        })
                                                        .catch(() => Observable.of(this.rootActions.error("Can't not create order offline count", null, false)));
                                     });
  
  @Effect() retrieveReceipt = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                  .filter((action: Action) => action.payload['entityCode'] === ReceiptDB.getCode())
                                  .withLatestFrom(this.store$.select('entities'))
                                  .withLatestFrom(this.store$.select('general'),
                                                  ([action, entitiesState], generalState) => [action, entitiesState, generalState])
                                  .filter((z) => !!(z[2] as PosGeneralState).outlet && !!(z[2] as PosGeneralState).outlet['id'])
                                  .map(([action, entitiesState, generalState]) => {
                                    let receipt;
                                    receipt = (entitiesState as PosEntitiesState).receipts.items.find((r) => parseInt(r['id'] + '') === parseInt((generalState as PosGeneralState).outlet['paper_receipt_template_id'] + ''));
                                    if (!receipt) {
                                      receipt = (entitiesState as PosEntitiesState).receipts.items.find((r) => r['is_default'] === true);
                                    }
    
                                    return this.configActions.saveReceiptSetting(receipt);
                                  });
}
