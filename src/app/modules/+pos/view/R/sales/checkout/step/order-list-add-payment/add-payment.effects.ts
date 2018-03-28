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
import {CheckoutStep, Payment3rd, PaymentMethod, PosStepState} from "../step.state";
import {Timezone} from "../../../../../../core/framework/General/DateTime/Timezone";
import {PosGeneralState} from "../../../../../../R/general/general.state";
import * as _ from 'lodash';
import {Observable} from "rxjs";
import {RootActions} from "../../../../../../../../R/root.actions";
import {EntityActions} from "../../../../../../R/entities/entity/entity.actions";
import {OrderDB} from "../../../../../../database/xretail/db/order";
import {ListActions} from "../../../orders/list/list.actions";
import {ReceiptActions} from "../../../receipts/receipt.actions";
import {PaymentDB} from "../../../../../../database/xretail/db/payment";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";

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
              private entityActions: EntityActions,
              private receiptActions: ReceiptActions,
              private orderListActions: ListActions) { }
  
  @Effect() prepareOrderDataToAdd = this.actions$
                                        .ofType(OrderListAddPaymentActions.ACTION_NEED_ADD_PAYMENT)
                                        .withLatestFrom(this.store$.select('config'))
                                        .filter(() => {
                                          if (!this.offlineService.online) {
                                            this.notify.error('can_not_refund_in_offline_mode');
                                          }
                                          return this.offlineService.online;
                                        })
                                        .map((z) => {
                                          const action: Action  = z[0];
                                          const order           = action.payload['order'];
                                          const totals          = this.stepService.calculateTotals(<any>z[1], <any>List.of(), this.orderListAddPaymentService.getTotalDue(order));
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
                              .withLatestFrom(this.store$.select('entities'), (z, z1) => [...z, z1])
                              .filter((z) => (z[1] as PosStepState).checkoutStep === CheckoutStep.TAKE_PAYMENT)
                              .filter((z) => (z[1] as PosStepState).isChecking3rd === false)
                              .filter((z) => !!(z[1] as PosStepState).orderOffline && !isNaN((z[1] as PosStepState).orderOffline['order_id']))
                              .switchMap((z) => {
                                const posStepState: PosStepState      = <any>z[1];
                                const generalState: PosGeneralState   = <any>z[3];
                                const entitiesState: PosEntitiesState = <any>z[5];
                                const payments: List<PaymentDB>       = entitiesState[PaymentDB.getCode()].items;
                                let paymentInUse: List<PaymentMethod> = posStepState.paymentMethodUsed;
                                let roundingCashPaymentId             = null;
  
                                payments.forEach((p) => {
                                  if (p['type'] === 'rounding_cash') {
                                    roundingCashPaymentId = p['id'];
                                  }
                                });
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
                                if (posStepState.totals.rounding !== 0) {
                                  paymentInUse = paymentInUse.push({
                                                                     id: roundingCashPaymentId,
                                                                     type: "rounding_cash",
                                                                     title: "Cash Rounding",
                                                                     // We save to payment data in order, not payment_transaction, so need this field
                                                                     is_purchase: 1,
                                                                     amount: posStepState.totals.rounding,
                                                                     isChanging: false,
                                                                     created_at: Timezone.getCurrentStringTime(true)
                                                                   });
                                }
                                let data             = {};
                                data['payment_data'] = paymentInUse.toJS();
                                data['order_id']     = posStepState.orderOffline['order_id'];
                                data['store_id']     = generalState.store['id'];
                                data['outlet_id']    = generalState.outlet['id'];
                                data['register_id']  = generalState.register['id'];
    
                                return this.addPaymentService
                                           .createAddPaymentRequest(data, generalState)
                                           .flatMap((res) => {
                                                      if (res.hasOwnProperty("items") && _.size(res['items']) === 1) {
                                                        let order = new OrderDB();
                                                        order     = order.addData(res['items'][0]);
        
                                                        return Observable.fromPromise(this.addPaymentService.updateOrderToDB(order, 'order_id'))
                                                                         .flatMap(() => {
                                                                           this.notify.success("take_payment_success");
          
                                                                           let ob = [
                                                                             this.entityActions.pushEntity(order, OrderDB.getCode(), 'order_id', false),
                                                                             this.addPaymentActions.addPaymentSuccess(order, false),
                                                                             this.orderListActions.selectOrderDetail(order, false)
                                                                           ];
                                                                           if (posStepState.listPayment3rdData.count() > 0) {
                                                                             const payment3rd: Payment3rd           = posStepState.listPayment3rdData.first();
                                                                             let {customerReceipt, merchantReceipt} = payment3rd;
                                                                             ob.push(this.receiptActions.printSalesReceipt(posStepState.orderOffline, 'receipt', customerReceipt, merchantReceipt, false));
                                                                           }
                                                                           return Observable.from(ob);
                                                                         });
                                                      } else {
        
                                                        return Observable.of(this.rootActions.error('add_payment_error', null, false));
                                                      }
                                                    }
                                           ).catch((e) => Observable.of(this.rootActions.error('add_payment_error', e, false)));
                              });
}
