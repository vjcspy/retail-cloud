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
import {PaymentMethod, PosStepState} from "./step.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {Timezone} from "../../../../../core/framework/General/DateTime/Timezone";
import {MoneySuggestionService} from "../../../../../services/helper/money-suggestion";
import {Observable} from "rxjs";
import {PosQuoteService} from "../../../../../R/quote/quote.service";
import {PosSyncService} from "../../../../../R/sync/sync.service";

@Injectable()
export class PosStepEffects {
  
  private moneySuggestion = new MoneySuggestionService();
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private notify: NotifyManager,
              private offlineService: OfflineService,
              private posQuoteService: PosQuoteService,
              private syncService: PosSyncService) { }
  
  @Effect() getPaymentCanUse = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                   .filter((action: Action) => action.payload['entityCode'] === PaymentDB.getCode())
                                   .withLatestFrom(this.store$.select('entities'))
                                   .map(([action, entitiesState]) => {
                                     const payments: List<PaymentDB> = entitiesState[PaymentDB.getCode()].items;
                                     let paymentMethodCanUse         = List.of();
                                     payments.forEach((p) => {
                                       if (!!p.is_active) {
                                         paymentMethodCanUse = paymentMethodCanUse.push(p);
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
                                           let totals            = this.calculateTotals(<any>List.of(), posQuoteState.grandTotal);
                                           const moneySuggestion = this.moneySuggestion.getSuggestion(posQuoteState.grandTotal);
                                           return {
                                             type: PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA,
                                             payload: {totals, moneySuggestion}
                                           };
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
                                              const paymentToAdd: PaymentMethod = z[0].payload['payment'];
                                              const quoteState: PosQuoteState   = <any>z[1];
                                              let amount                        = this.canAddMorePaymentMethod(paymentToAdd, z[3], z[2], quoteState);
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
      
                                                return {type: PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER, payload: {payment}};
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
                                      let totals                    = this.calculateTotals(stepState.paymentMethodUsed, stepState.totals.grandTotal);
                                      let moneySuggestion           = stepState.moneySuggestion;
    
                                      // Retrieve amount before payment added
                                      if (action.type === PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER) {
                                        moneySuggestion = this.moneySuggestion.getSuggestion(totals.remain + action.payload['payment']['amount']);
                                      }
    
                                      return {
                                        type: PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA,
                                        payload: {totals, moneySuggestion}
                                      };
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
    
                                         return {type: PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER, payload: {isChecking3rd}};
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
                                        return {type: PosStepActions.ACTION_PROCESS_PAYMENT_3RD, payload: {payment3rdData}};
                                      } else {
                                        return {type: PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD}
                                      }
                                    });
  
  @Effect() saveOrder = this.actions$
                            .ofType(
                              PosStepActions.ACTION_CHECK_BEFORE_SAVE_ORDER,
                              PosStepActions.ACTION_RESOLVE_ALL_PAYMENT_3RD)
                            .withLatestFrom(this.store$.select('step'))
                            .withLatestFrom(this.store$.select('quote'), (z, z1) => [...z, z1])
                            .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                            .withLatestFrom(this.store$.select('config'), (z, z1) => [...z, z1])
                            .filter((z) => (z[1] as PosStepState).isChecking3rd === false)
                            .switchMap((z) => {
                              const posStepState: PosStepState      = <any>z[1];
                              let paymentInUse: List<PaymentMethod> = posStepState.paymentMethodUsed;
    
                              // Save order function
                              if (posStepState.totals.remain < -0.01) {
                                paymentInUse = paymentInUse.push({
                                                                   type: "cash",
                                                                   title: "Change",
                                                                   // We save to payment data in order, not payment_transaction, so need this field
                                                                   is_purchase: true,
                                                                   amount: posStepState.totals.remain,
                                                                   isChanging: false,
                                                                   created_at: Timezone.getCurrentStringTime()
                                                                 });
                              }
    
                              const posQuoteState: PosQuoteState = <any>z[2];
                              if (posQuoteState.info.isRefunding) {
                                return Observable.fromPromise(this.posQuoteService.loadCreditmemo(null, null, null))
                                                 .map(() => {
                                                   // push to db
                                                 });
                              } else {
                                if (posQuoteState.items.count() > 0 && posQuoteState.quote.getRewardPointData()['use_reward_point'] !== true) {
                                  return Observable.fromPromise(this.syncService.saveOrderOffline(z[2], z[3], z[4]))
                                                   .map((orderOffline) => {
                                                     return {type: PosStepActions.ACTION_SAVED_ORDER, payload: {orderOffline}};
                                                   })
                                                   .catch((e) => Observable.of(<any>{
                                                     type: PosStepActions.ACTION_SAVE_ORDER_FAILED,
                                                     payload: {e, isSaveOnline: false}
                                                   }));
                                } else if (posQuoteState.items.count() > 0 && posQuoteState.quote.getRewardPointData()['use_reward_point'] === true) {
                                  return Observable.fromPromise(this.syncService.saveOrderOnline(z[2], z[3], z[4], false))
                                                   .map((orderOffline) => {
                                                     return {type: PosStepActions.ACTION_SAVED_ORDER, payload: {orderOffline}};
                                                   })
                                                   .catch((e) => Observable.of(<any>{
                                                     type: PosStepActions.ACTION_SAVE_ORDER_FAILED,
                                                     payload: {e, isSaveOnline: true}
                                                   }));
                                }
                              }
                            });
  
  
  private calculateTotals(paymentInUse: List<PaymentMethod>, grandTotal: number) {
    let totalPaid = 0;
    paymentInUse.forEach((p) => {
      totalPaid += this.getvalidatedAmountPayment(p.amount);
    });
    let remain = grandTotal - totalPaid;
    return {totalPaid, remain, grandTotal};
  }
  
  canAddMorePaymentMethod(method: PaymentMethod, stepState: PosStepState, configState: PosConfigState, quoteState: PosQuoteState): number | boolean {
    // check split payment
    if (stepState.paymentMethodUsed.count() >= 1 && (!configState.posRetailConfig.allowSplitPayment || quoteState.info.isRefunding))
      return false;
    
    // check payment gateway
    if (method['type'] == 'tyro') {
      let isDuplicate = false;
      stepState.paymentMethodUsed.forEach((_method: PaymentMethod) => {
        if ('tyro' == _method['type']) {
          isDuplicate = true;
          return false;
        }
      });
      if (isDuplicate) {
        this.notify.warning('can_not_add_tyro');
        return false;
      }
    }
    
    // check amount
    let gt             = stepState.totals.grandTotal;
    let _currentAmount = 0;
    stepState.paymentMethodUsed.forEach((method: PaymentMethod) => {
      _currentAmount += this.getvalidatedAmountPayment(method.amount);
    });
    if (_currentAmount >= gt && !quoteState.info.isRefunding)
      return false;
    
    return NumberHelper.round((gt - _currentAmount), 2);
  }
  
  private getvalidatedAmountPayment(methodAmount: any): number {
    return (isNaN(methodAmount) || !methodAmount) ? 0 : parseFloat(methodAmount + '');
  }
  
}
