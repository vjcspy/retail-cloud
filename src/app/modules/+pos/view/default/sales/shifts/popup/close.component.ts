import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ShiftState} from "../../../../R/sales/shifts/shift.state";
import {AuthenticateService} from "../../../../../../../services/authenticate";
import {ShiftDetailActions} from "../../../../R/sales/shifts/detail/detail.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ShiftActions} from "../../../../R/sales/shifts/shift.actions";
import {FormValidationService} from "../../../../../../share/provider/form-validation";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-popup-close',
             templateUrl: 'close.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsPopupCloseComponent {
  @Input() shiftState: ShiftState;
  
  protected _data = {
    expected: {},
    counted: {},
    note: "",
    takeOut: 0,
  };
  
  constructor(public authenticate: AuthenticateService,
              public shiftDetailActions: ShiftDetailActions,
              public notify: NotifyManager,
              public shiftActions: ShiftActions,
              public formValidation: FormValidationService) { }
  
  getExpectedAmount(paymentData) {
    if (!this._data.expected.hasOwnProperty(paymentData['id'])) {
      let expected = 0;
      expected += paymentData.sales + paymentData.refund;
      if (paymentData['type'] === 'cash') {
        expected += this.shiftState.detail.amounts.totals.inOut;
        expected += parseFloat(this.shiftState.detail.shift['start_amount']);
      }
      this._data.expected[paymentData['id']] = expected;
    }
    return this._data.expected[paymentData['id']];
  }
  
  getDiff(paymentData) {
    return parseFloat(this._data.counted[paymentData['id']]) - this.getExpectedAmount(paymentData);
  }
  
  closeShift() {
    // if (this.authenticate.userCan('open_and_close_register')) {
      this.formValidation.submit('popup-close-shift', () => {
        this.shiftDetailActions.closeShift(this.shiftState.detail.shift, this._data);
      }, true);
    // } else {
    //   this.notify.warning("not_have_permission_to_close_shift");
    // }
  }
  
  cancel() {
    this.formValidation.cancel('popup-close-shift', () => {
      this.shiftActions.changeStatePopup(null);
    });
  }
}
