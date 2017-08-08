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
import {CheckoutStep, PaymentMethod, PosStepState} from "./step.state";
import {Timezone} from "../../../../../core/framework/General/DateTime/Timezone";
import {Observable} from "rxjs";
import {PosSyncService} from "../../../../../R/sync/sync.service";
import {PosStepService} from "./step.service";
import {MoneySuggestion} from "../../../../../services/helper/money-suggestion";
import {Router} from "@angular/router";
import {QuoteRefundActions} from "../../../../../R/quote/refund/refund.actions";
import {EntityActions} from "../../../../../R/entities/entity/entity.actions";
import {OrderDB} from "../../../../../database/xretail/db/order";

@Injectable()
export class PosStepEffects {
  
  private moneySuggestion = new MoneySuggestion();
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private notify: NotifyManager,
              private router: Router,
              private offlineService: OfflineService,
              private syncService: PosSyncService,
              private stepActions: PosStepActions,
              private stepService: PosStepService,
              private refundActions: QuoteRefundActions,
              private entityActions: EntityActions) { }
  
  @Effect() getPaymentCanUse = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                   .filter((action: Action) => action.payload['entityCode'] === PaymentDB.getCode())
                                   .withLatestFrom(this.store$.select('entities'))
                                   .map(([action, entitiesState]) => {
                                     const payments: List<PaymentDB> = entitiesState[PaymentDB.getCode()].items;
                                     let paymentMethodCanUse         = List.of();
                                     let cashPaymentId               = null;
                                     payments.forEach((p) => {
                                       if (p['type'] === 'cash') {
                                         cashPaymentId = p['id'];
                                       }
                                       if (!!p.is_active) {
                                         paymentMethodCanUse = paymentMethodCanUse.push(p);
                                       }
                                     });
    
                                     return this.stepActions.savePaymentMethodCanUseFromDB(paymentMethodCanUse, cashPaymentId, false);
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
                                           let totals            = this.stepService.calculateTotals(<any>List.of(), posQuoteState.grandTotal);
                                           const moneySuggestion = this.moneySuggestion.getSuggestion(posQuoteState.grandTotal);
      
                                           return this.stepActions.updatedCheckoutPaymentData(totals, moneySuggestion, false);
                                         }
    
                                         return {type: RootActions.ACTION_ERROR, payload: {mess: "can't init checkout step data"}};
                                       });
  
  @Effect() checkMethodWhenUserSelect = this.actions$.ofType(PosStepActions.ACTION_USER_SELECT_PAYMENT_METHOD)
                                            .withLatestFrom(this.store$.select('quote'))
                                            .withLatestFrom(this.store$.select('config'),
                                                            ([action, quoteState], configState) => [action, quoteState, configState])
                                            .withLatestFrom(this.store$.select('step'),
                                                            ([action, quoteState, configState], stepState) => [action,
                                                                                                               quoteState,
                                                                                                               configState,
                                                                                                               stepState])
                                            .map((z) => {
                                              const paymentToAdd: PaymentMethod = (z[0] as any).payload['payment'];
                                              const quoteState: PosQuoteState   = <any>z[1];
                                              let amount                        = this.stepService.canAddMorePaymentMethod(paymentToAdd, <any>z[3], <any>z[2], <any>quoteState);
                                              if (amount !== false) {
                                                let payment = {
                                                  id: paymentToAdd['id'],
                                                  type: paymentToAdd.type,
                                                  title: paymentToAdd.title,
                                                  // code: Date.now(),
                                                  amount: parseFloat(<any>amount),
                                                  refund_amount: quoteState.creditmemo ? quoteState.creditmemo['totals']['grand_total'] : 0,
                                                  data: {},
                                                  isChanging: paymentToAdd.allow_amount_tendered && !quoteState.info.isRefunding,
                                                  allow_amount_tendered: paymentToAdd.allow_amount_tendered,
                                                  created_at: Timezone.getCurrentStringTime(),
                                                  is_purchase: quoteState.info.isRefunding ? 0 : 1,
                                                  payment_data: paymentToAdd['payment_data'] // config data of payment
                                                };
      
                                                return this.stepActions.addPaymentMethodToOrder(payment, false);
                                              } else {
                                                return {type: RootActions.ACTION_NOTHING, payload: {mess: "Can't add more payment method"}};
                                              }
                                            });
  
  @Effect() checkChangeTotals = this.actions$
                                    .ofType(
                                      PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER,
                                      PosStepActions.ACTION_REMOVE_PAYMENT_METHOD_FROM_ORDER,
                                      PosStepActions.ACTION_CHANGE_AMOUNT_PAYMENT)
                                    .withLatestFrom(this.store$.select('step'))
                                    .map((z) => {
                                      const stepState: PosStepState = <any>z[1];
                                      const action: Action          = z[0];
                                      let totals                    = this.stepService.calculateTotals(stepState.paymentMethodUsed, stepState.totals.grandTotal);
                                      let moneySuggestion           = stepState.moneySuggestion;
    
                                      // Retrieve amount before payment added
                                      if (action.type === PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER) {
                                        moneySuggestion = this.moneySuggestion.getSuggestion(totals.remain + action.payload['payment']['amount']);
                                      }
    
                                      return this.stepActions.updatedCheckoutPaymentData(totals, moneySuggestion, false);
                                    });
  
  @Effect() checkBeforeSaveOrder = this.actions$
                                       .ofType(PosStepActions.ACTION_START_SAVE_ORDER)
                                       .withLatestFrom(this.store$.select('step'))
                                       .map((z) => {
                                         const stepState: PosStepState = <any>z[1];
    
                                         // checking 3rd payment
                                         let isChecking3rd = false;
                                         stepState.listPayment3rdData.forEach((payment) => {
                                           if (payment.inUse && !payment.isPaySuccess) {
                                             isChecking3rd = true;
                                             return false;
                                           }
                                         });
    
                                         return this.stepActions.saveDataCheckingBeforeSaveOrder(isChecking3rd, false);
                                       });
  
  @Effect() resolve3rdPayment = this.actions$
                                    .ofType(
                                      PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER,
                                      PosStepActions.ACTION_PAYMENT_3RD_PAY_SUCCESS
                                    )
                                    .withLatestFrom(this.store$.select('step'))
                                    .filter((z) => (z[1] as PosStepState).isChecking3rd === true)
                                    .map((z) => {
                                      const stepState: PosStepState = <any>z[1];
    
                                      const payment3rdData = stepState.listPayment3rdData.find((payment) => payment.inUse && !payment.isPaySuccess);
    
                                      if (payment3rdData) {
                                        return this.stepActions.process3rdPayment(payment3rdData, false);
                                      } else {
                                        return this.stepActions.resolvedAll3rdPayment(false);
                                      }
                                    });
  
  @Effect() saveOrder = this.actions$
                            .ofType(
                              PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER,
                              PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD,
                              QuoteRefundActions.ACTION_SAVE_CREDITMEMO_SUCCESS)
                            .withLatestFrom(this.store$.select('step'))
                            .withLatestFrom(this.store$.select('quote'), (z, z1) => [...z, z1])
                            .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                            .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                            .filter((z) => (z[1] as PosStepState).checkoutStep === CheckoutStep.PAYMENT)
                            .filter((z) => (z[1] as PosStepState).isChecking3rd === false)
                            .switchMap((z) => {
                              const posStepState: PosStepState      = <any>z[1];
                              const posQuoteState: PosQuoteState    = <any>z[2];
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
                              posQuoteState.quote.setPaymentData(paymentInUse.toJS());
    
                              if (posQuoteState.info.isRefunding) {
                                return Observable.of(this.refundActions.loadCreditmemo(posQuoteState.creditmemo['order_id'], true, false));
                              } else {
                                if (posQuoteState.items.count() > 0 && (!posQuoteState.quote.getRewardPointData() || posQuoteState.quote.getRewardPointData()['use_reward_point'] !== true)) {
                                  return Observable.fromPromise(this.syncService.saveOrderOffline(<any>z[2], <any>z[3], <any>z[4]))
                                                   .flatMap((orderOffline) => {
                                                     let order = new OrderDB();
                                                     order.addData(orderOffline);
          
                                                     return Observable.from([
                                                                              this.stepActions.savedOrder(orderOffline, true, false),
                                                                              this.entityActions.pushEntity(order, OrderDB.getCode(), null, false)
                                                                            ]);
                                                   })
                                                   .catch((e) => Observable.of(this.stepActions.saveOrderFailed(e, true, false)));
                                } else if (posQuoteState.items.count() > 0 && posQuoteState.quote.getRewardPointData()['use_reward_point'] === true) {
                                  return Observable.fromPromise(this.syncService.saveOrderOnline(<any>z[2], <any>z[3], <any>z[4]))
                                                   .flatMap((orderOffline) => {
                                                     let order = new OrderDB();
                                                     order.addData(orderOffline);
          
                                                     return Observable.from([
                                                                              this.stepActions.savedOrder(orderOffline, false, false),
                                                                              this.entityActions.pushEntity(order, OrderDB.getCode(), null, false)
                                                                            ]);
                                                   })
                                                   .catch((e) => Observable.of(this.stepActions.saveOrderFailed(e, true, false)));
                                } else {
                                  return Observable.of(this.stepActions.savedOrder(null, false, false));
                                }
                              }
                            });
}
