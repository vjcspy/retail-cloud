import {Injectable} from '@angular/core';
import {PaymentMethod, PosStepState} from "./step.state";
import {List} from "immutable";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import * as _ from "lodash";
import {RoundingCash} from "../../../../../services/helper/rounding-cash";

@Injectable()
export class PosStepService {
  private roundingCash = new RoundingCash();

  constructor(private notify: NotifyManager) {
  }

  calculateTotals(configState: PosConfigState, paymentInUse: List<PaymentMethod>, grandTotal: number) {
    let totalPaid = 0;
    paymentInUse.forEach((p) => {
      totalPaid += this.getvalidatedAmountPayment(p.amount);
    });
    
    let cashRounded = 0;
    paymentInUse.forEach((p) => {
      if (['cash'].indexOf(p['type']) >= 0) {
        cashRounded += this.getvalidatedAmountPayment(p.amount);
      }
    });
  
    this.roundingCash.setConfigRoundingCash(configState.roundingCash);
    let _amount = this.roundingCash.getRoundingCash(grandTotal);
    
    let rounding = 0;
    if (Math.abs(cashRounded) > 0 && (Math.abs(NumberHelper.round(totalPaid)) > Math.abs(NumberHelper.round(grandTotal)) || (Math.abs(NumberHelper.round(_amount)) < Math.abs(NumberHelper.round(grandTotal)) && ((Math.abs(NumberHelper.round(totalPaid)) === Math.abs(NumberHelper.round(_amount)) || (Math.abs(NumberHelper.round(totalPaid)) > Math.abs(NumberHelper.round(_amount)))))))) {
      rounding = grandTotal - _amount;
    }
    let remain = NumberHelper.round(grandTotal - totalPaid - rounding);
    return {totalPaid, remain, grandTotal, rounding};
  }

  canAddMorePaymentMethod(method: PaymentMethod, stepState: PosStepState, configState: PosConfigState, quoteState: PosQuoteState): number | boolean {
    // check split payment
    if (stepState.paymentMethodUsed.count() >= 1 && (!configState.posRetailConfig.allowSplitPayment || quoteState.info.isRefunding)) {
      return false;
    }

    // check payment gateway
    if (['tyro'].indexOf(method['type']) >= 0 && stepState.listPayment3rdData.count() > 0) {
      this.notify.warning("can't_add_more_3rd_payment");

      return false;
    }

    // check amount
    let gt             = stepState.totals.grandTotal;
    let _currentAmount = 0;
    stepState.paymentMethodUsed.forEach((_method: PaymentMethod) => {
      _currentAmount += this.getvalidatedAmountPayment(_method.amount);
    });

    if (_currentAmount >= gt && !quoteState.info.isRefunding) {
      return false;
    }
    
    let _amount = gt - _currentAmount;
    
    // Retrieve cash rounding
    if (['cash'].indexOf(method['type']) >= 0) {
      this.roundingCash.setConfigRoundingCash(configState.roundingCash);
      _amount = this.roundingCash.getRoundingCash(_amount);
    }

    return NumberHelper.round((_amount), 2);
  }
  
  roundingRefundAmount(method: PaymentMethod, amount, configState: PosConfigState): number {
    if (['cash'].indexOf(method['type']) >= 0) {
      this.roundingCash.setConfigRoundingCash(configState.roundingCash);
      amount = this.roundingCash.getRoundingCash(amount);
  
    }
    return amount;
  }

  getvalidatedAmountPayment(methodAmount: any): number {
    return (isNaN(methodAmount) || !methodAmount) ? 0 : parseFloat(methodAmount + '');
  }
}
