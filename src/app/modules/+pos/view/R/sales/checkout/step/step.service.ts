import {Injectable} from '@angular/core';
import {PaymentMethod, PosStepState} from "./step.state";
import {List} from "immutable";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import * as _ from "lodash";

@Injectable()
export class PosStepService {

  constructor(private notify: NotifyManager) {
  }

  calculateTotals(paymentInUse: List<PaymentMethod>, grandTotal: number) {
    let totalPaid = 0;
    paymentInUse.forEach((p) => {
      totalPaid += this.getvalidatedAmountPayment(p.amount);
    });
    let remain = grandTotal - totalPaid;
    return {totalPaid, remain, grandTotal};
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

    return NumberHelper.round((gt - _currentAmount), 2);
  }

  getvalidatedAmountPayment(methodAmount: any): number {
    return (isNaN(methodAmount) || !methodAmount) ? 0 : parseFloat(methodAmount + '');
  }
}
