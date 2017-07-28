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

@Injectable()
export class OrderDetailEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private listActions: ListActions,
              private notify: NotifyManager,
              private syncActions: PosSyncActions,
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
}
