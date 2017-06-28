import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {OrderListAddPaymentActions} from "./add-payment.actions";
import {OfflineService} from "../../../../../../../share/provider/offline";
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {PosStepService} from "../step.service";
import {List} from "immutable";
import {OrderListAddPaymentService} from "./add-payment.service";
import {PosStepActions} from "../step.actions";
import {MoneySuggestion} from "../../../../../../services/helper/money-suggestion";

@Injectable()
export class OrderListAddPaymentEffects {
  protected moneySuggestion = new MoneySuggestion();
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private offlineService: OfflineService,
              private notify: NotifyManager,
              private stepService: PosStepService,
              private orderListAddPaymentService: OrderListAddPaymentService,
              private stepActions: PosStepActions) { }
  
  @Effect() prepareOrderDataToAdd = this.actions$
                                        .ofType(OrderListAddPaymentActions.ACTION_NEED_ADD_PAYMENT)
                                        .filter(() => {
                                          if (!this.offlineService.online) {
                                            this.notify.error('can_not_refund_in_offline_mode');
                                          }
                                          return this.offlineService.online;
                                        })
                                        .map((action) => {
                                          // const action: Action  = z[0];
                                          const order           = action.payload['order'];
                                          const totals          = this.stepService.calculateTotals(<any>List.of(), this.orderListAddPaymentService.getTotalDue(order));
                                          const moneySuggestion = this.moneySuggestion.getSuggestion(totals['grandTotal']);
    
                                          return this.stepActions.updatedCheckoutPaymentData(totals, moneySuggestion, false);
                                        });
}
