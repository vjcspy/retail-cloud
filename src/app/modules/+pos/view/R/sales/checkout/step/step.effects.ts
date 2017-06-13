import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {PaymentDB} from "../../../../../database/xretail/db/payment";
import {List} from "immutable";
import {PosStepActions} from "./step.actions";
import {PosSyncActions} from "../../../../../R/sync/sync.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {OfflineService} from "../../../../../../share/provider/offline";
import {RootActions} from "../../../../../../../R/root.actions";

@Injectable()
export class PosStepEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private notify: NotifyManager, private offlineService: OfflineService) { }
  
  @Effect() getPaymentCanUse = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                   .filter((action: Action) => action.payload['entityCode'] === PaymentDB.getCode())
                                   .withLatestFrom(this.store$.select('entities'))
                                   .map(([action, entitiesState]) => {
                                     const payments: List<PaymentDB> = entitiesState[PaymentDB.getCode()].items;
                                     let paymentMethodCanUse         = [];
                                     payments.forEach((p) => {
                                       if (!!p.is_active) {
                                         paymentMethodCanUse.push(p);
                                       }
                                     });
    
                                     return {type: PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE, payload: {paymentMethodCanUse}};
                                   });
  
  @Effect() initCheckoutStepData = this.actions$.ofType(PosSyncActions.ACTION_SYNC_ORDER_SUCCESS)
                                       .withLatestFrom(this.store$.select('quote'))
                                       .map((z) => {
                                         const posQuoteState: PosQuoteState = <any>z[1];
    
                                         if (posQuoteState.info.isRefunding && !this.offlineService.online) {
                                           this.notify.error('can_not_refund_in_offline_mode');
      
                                           return {type: RootActions.ACTION_NOTHING, payload: {mess: "can_not_refund_in_offline_mode"}};
                                         }
    
                                         if (posQuoteState.items.count() > 0 || posQuoteState.info.isRefunding) {
                                           return {type: PosStepActions.ACTION_INIT_CHECKOUT_STEP_DATA};
                                         }
    
                                         return {type: RootActions.ACTION_ERROR, payload: {mess: "can't init checkout step data"}};
                                       });
}
