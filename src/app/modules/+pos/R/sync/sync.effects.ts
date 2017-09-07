import {Injectable} from '@angular/core';
import {Store, Action} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosSyncActions} from "./sync.actions";
import {PosSyncService} from "./sync.service";
import {Observable} from "rxjs";
import * as _ from 'lodash';
import {NotifyManager} from "../../../../services/notify-manager";
import {OfflineService} from "../../../share/provider/offline";
import {IntegrateRpActions} from "../integrate/rp/integrate-rp.actions";
import {PosStepState} from "../../view/R/sales/checkout/step/step.state";
import {PosSyncState} from "./sync.state";
import {RootActions} from "../../../../R/root.actions";
import {PosPullState} from "../entities/pull.state";
import {PosStepActions} from "../../view/R/sales/checkout/step/step.actions";
import {PosQuoteState} from "../quote/quote.state";
import {EntityActions} from "../entities/entity/entity.actions";
import {OrderDB} from "../../database/xretail/db/order";
import {PosGeneralState} from "../general/general.state";

@Injectable()
export class PosSyncEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private posSyncService: PosSyncService,
              private notify: NotifyManager,
              private offline: OfflineService,
              private syncActions: PosSyncActions,
              private entityActions: EntityActions,
              private rootActions: RootActions) { }
  
  @Effect() prepareOrderToSync = this.actions$
                                     .ofType(
                                       PosSyncActions.ACTION_START_SYNC_CURRENT_ORDER,
                                       // use or remove rp
                                       IntegrateRpActions.ACTION_USE_REWARD_POINT,
                                       IntegrateRpActions.ACTION_REMOVE_REWARD_POINT
                                     )
                                     .withLatestFrom(this.store$.select('general'))
                                     .withLatestFrom(this.store$.select('quote'),
                                                     ([action, generalState], quoteState) => [action, generalState, quoteState])
                                     .map((z: any) => {
                                       const quoteState: PosQuoteState     = z[2];
                                       const generalState: PosGeneralState = z[1];
                                       if (quoteState.items.count() > 0) {
                                         return this.syncActions.saveOrderPreparedAndSync(this.posSyncService.prepareOrder(<any>quoteState, <any>generalState), z[0]['payload']['goStep'] !== false, false);
                                       } else if (quoteState.info.isRefunding) {
                                         return this.syncActions.syncOrderSuccess(quoteState.quote, null, false);
                                       } else {
                                         return this.rootActions.error("nothing_to_sync", null, false);
                                       }
                                     });
  
  @Effect() syncOrder = this.actions$
                            .ofType(
                              PosSyncActions.ACTION_PREPARE_ORDER_SYNC
                            )
                            .withLatestFrom(this.store$.select('general'))
                            .withLatestFrom(this.store$.select('quote'),
                                            ([action, generalState], quoteState) => [action, generalState, quoteState])
                            .switchMap(([action, generalState, quoteState]) => {
                              const quote = (quoteState as PosQuoteState).quote;
                              if (this.offline.online) {
                                return this.posSyncService.syncOrderOnline((action as Action).payload['order'], <any>generalState)
                                           .map((syncData) => {
                                             const address = quote.getShippingAddress();
        
                                             _.forEach(syncData['totals'], (total, key) => {
                                               if (total !== null) {
                                                 address.setData(key, total);
                                               }
                                             });
                                             if (syncData.hasOwnProperty("reward_point") && _.isObject(syncData["reward_point"])) {
                                               quote.setData('reward_point', syncData["reward_point"]);
                                             } else {
                                               quote.unsetData("reward_point");
                                             }
                                             if (syncData['totals']['coupon_code']) {
                                               this.notify.success('coupon_code_accepted');
                                             }
        
                                             quote.setSyncedItems(syncData['items']);
        
                                             return this.syncActions.syncOrderSuccess(quote, syncData,action['payload']['goStep'], false);
                                           })
                                           .catch((e) => Observable.of(this.syncActions.syncOrderError(e, false)));
                              } else {
                                return Observable.of(this.syncActions.syncOrderSuccess(quote, null, false));
                              }
                            });
  
  @Effect() autoSyncOfflineOrder = this.actions$
                                       .ofType(
                                         PosSyncActions.ACTION_AUTOMATIC_SYNC_OFFLINE_ORDER,
                                         PosStepActions.ACTION_SAVED_ORDER
                                       )
                                       .withLatestFrom(this.store$.select('step'))
                                       .withLatestFrom(this.store$.select('sync'), (z, z1) => [...z, z1])
                                       .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                                       .withLatestFrom(this.store$.select('pull'), (z, z1) => [...z, z1])
                                       .switchMap((z) => {
                                         let isSyncing  = false;
                                         let isPushFull = false;
                                         return Observable.interval(5000)
                                                          .takeWhile(() => isPushFull === false)
                                                          .filter(() => {
                                                            return isSyncing === false && this.offline.online && !(z[1] as PosStepState).isSavingOrder && !(z[2] as PosSyncState).isSyncing && !(z[4] as PosPullState).isPullingChain;
                                                          })
                                                          .flatMap(() => {
                                                                     isSyncing = true;
                                                                     return Observable.fromPromise(this.posSyncService.autoGetAndPushOrderOffline(<any>z[3]))
                                                                                      .flatMap((res) => {
                                                                                        isSyncing = false;
                                                                                        if (res['data']['syncAllOfflineOrder'] === true) {
                                                                                          isPushFull = true;
                                                                                        }
                                                                                        let ob: any = [this.syncActions.syncedOfflineOrder(res['data'], false)];
                                                                                        if (res['data'].hasOwnProperty('orderOffline')) {
                                                                                          ob.push(this.entityActions.pushEntity(res['data']['orderOffline'], OrderDB.getCode(), 'id', false));
                                                                                        }
        
                                                                                        return Observable.from(ob);
                                                                                      })
                                                                                      .catch((e) => {
                                                                                        isSyncing = false;
                                                                                        return Observable.of({
                                                                                                               type: RootActions.ACTION_ERROR,
                                                                                                               payload: {
                                                                                                                 e,
                                                                                                                 mess: "Can't push order offline"
                                                                                                               }
                                                                                                             });
                                                                                      });
                                                                   }
                                                          );
                                       });
}
