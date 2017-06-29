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
import {CheckoutStep, PaymentMethod, PosStepState} from "../step.state";
import {Timezone} from "../../../../../../core/framework/General/DateTime/Timezone";
import {PosGeneralState} from "../../../../../../R/general/general.state";
import * as _ from 'lodash';
import {Observable} from "rxjs";
import {RootActions} from "../../../../../../../../R/root.actions";
import {EntityOrderActions} from "../../../../../../R/entities/entity/order.actions";

@Injectable()
export class OrderListAddPaymentEffects {
  protected moneySuggestion = new MoneySuggestion();
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private offlineService: OfflineService,
              private notify: NotifyManager,
              private stepService: PosStepService,
              private orderListAddPaymentService: OrderListAddPaymentService,
              private stepActions: PosStepActions,
              private addPaymentService: OrderListAddPaymentService,
              private rootActions: RootActions,
              private addPaymentActions: OrderListAddPaymentActions,
              private entityOrderActions: EntityOrderActions) { }
  
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
  
  @Effect() pushPayment = this.actions$
                              .ofType(
                                PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER,
                                PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD)
                              .withLatestFrom(this.store$.select('step'))
                              .withLatestFrom(this.store$.select('quote'), (z, z1) => [...z, z1])
                              .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                              .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                              .filter((z) => (z[1] as PosStepState).checkoutStep === CheckoutStep.TAKE_PAYMENT)
                              .filter((z) => (z[1] as PosStepState).isChecking3rd === false)
                              .filter((z) => !!(z[1] as PosStepState).orderOffline && !isNaN((z[1] as PosStepState).orderOffline['order_id']))
                              .switchMap((z) => {
                                const posStepState: PosStepState      = <any>z[1];
                                const generalState: PosGeneralState   = <any>z[3];
                                let paymentInUse: List<PaymentMethod> = posStepState.paymentMethodUsed;
    
                                // Save order function
                                if (posStepState.totals.remain < -0.01) {
                                  paymentInUse = paymentInUse.push({
                                                                     id: posStepState.cashPaymentId,
                                                                     type: "cash",
                                                                     title: "Change",
                                                                     // We save to payment data in order, not payment_transaction, so need this field
                                                                     is_purchase: true,
                                                                     amount: posStepState.totals.remain,
                                                                     isChanging: false,
                                                                     created_at: Timezone.getCurrentStringTime()
                                                                   });
                                }
                                let data             = {};
                                data['payment_data'] = paymentInUse.toJS();
                                data['order_id']     = posStepState.orderOffline['order_id'];
                                data['outlet_id']    = generalState.outlet['id'];
                                data['register_id']  = generalState.register['id'];
    
                                return this.addPaymentService
                                           .createAddPaymentRequest(data, generalState)
                                           .flatMap((res) => {
                                                      if (res.hasOwnProperty("items") && _.size(res['items']) == 1) {
                                                        const order = res['items'][0];
        
                                                        return Observable.fromPromise(this.addPaymentService.updateOrderToDB(order, 'order_id'))
                                                                         .flatMap(() => {
                                                                           return Observable.from([
                                                                                                    this.entityOrderActions.putOrderEntity(order, 'order_id', false),
                                                                                                    this.addPaymentActions.addPaymentSuccess(order, false)
                                                                                                  ]);
                                                                         })
                                                      } else {
        
                                                        return Observable.of(this.rootActions.error('add_payment_error', null, false));
                                                      }
                                                    }
                                           ).catch((e) => Observable.of(this.rootActions.error('add_payment_error', e, false)));
                              });
}
