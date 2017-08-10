import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {OrderDetailActions} from "./detail.actions";
import {OrderDB} from "../../../../../database/xretail/db/order";
import {Observable} from "rxjs/Observable";
import {ListActions} from "../list/list.actions";
import {EntityActions} from "../../../../../R/entities/entity/entity.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";
import {OrderDetailService} from "./detail.service";
import * as _ from 'lodash';

@Injectable()
export class OrderDetailEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private listActions: ListActions,
              private notify: NotifyManager,
              private detailService: OrderDetailService,
              private syncActions: PosSyncActions,
              private detailActions: OrderDetailActions,
              private entityActions: EntityActions) { }
  
  @Effect() markAsResync = this.actions$
                               .ofType(
                                 OrderDetailActions.ACTION_MARK_AS_RESYNC
                               )
                               .filter((action: Action) => {
                                 const orderOffline = action.payload['orderOffline'];
                                 return parseInt(orderOffline['pushed']) === 3;
                               })
                               .switchMap((action: Action) => {
                                 let orderDB            = new OrderDB();
                                 const orderOffline     = action.payload['orderOffline'];
                                 orderOffline['pushed'] = 0;
    
                                 return Observable.fromPromise(orderDB.save(orderOffline))
                                                  .switchMap(() => {
                                                    this.notify.success("order_will_push_to_queue_to_sync");
      
                                                    return Observable.from([
                                                                             this.listActions.selectOrderDetail(orderOffline, false),
                                                                             this.entityActions.pushEntity(orderOffline, OrderDB.getCode(), 'id', false),
                                                                             this.syncActions.autoSyncOfflineOrder(false),
                                                                           ]);
                                                  });
                               });
  
  @Effect() shipOrder = this.actions$
                            .ofType(
                              OrderDetailActions.ACTION_SHIP_ORDER
                            )
                            .withLatestFrom(this.store$.select('general'))
                            .switchMap((z: any) => {
                              const orderToShip = z[0]['payload']['order'];
    
                              return this.detailService.createShipRequest(orderToShip['order_id'], z[1])
                                         .filter((data) => data.hasOwnProperty("items") && _.size(data['items']) == 1)
                                         .map((data) => {
                                           return data['items'][0];
                                         })
                                         .switchMap((order) => {
                                           let orderDB = new OrderDB();
                                           orderDB.addData(order);
                                           orderDB['id'] = orderToShip['id'];
      
                                           return Observable.fromPromise(orderDB.save(orderDB))
                                                            .switchMap(() => {
                                                              this.notify.success("ship_order_successfully");
        
                                                              return Observable.from([
                                                                                       this.listActions.selectOrderDetail(orderDB, false),
                                                                                       this.entityActions.pushEntity(orderDB, OrderDB.getCode(), 'id', false),
                                                                                     ]);
                                                            });
                                         })
                                         .catch((e) => Observable.of(this.detailActions.shipOrderFailed("ship_order_failed", e, false)));
                            });
}
