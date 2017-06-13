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
import * as _ from 'lodash';
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {Timezone} from "../../../../../core/framework/General/DateTime/Timezone";
import {MoneySuggestionService} from "../../../../../services/helper/money-suggestion";

@Injectable()
export class PosStepEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private notify: NotifyManager, private offlineService: OfflineService) { }
  
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
                                           let suggestion        = new MoneySuggestionService();
                                           const moneySuggestion = suggestion.getSuggestion(posQuoteState.grandTotal);
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
                                      let totals                    = this.calculateTotals(stepState.paymentMethodUsed, stepState.totals.grandTotal);
    
                                      return {
                                        type: PosStepActions.ACTION_UPDATE_CHECKOUT_PAYMENT_DATA,
                                        payload: {totals}
                                      };
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
