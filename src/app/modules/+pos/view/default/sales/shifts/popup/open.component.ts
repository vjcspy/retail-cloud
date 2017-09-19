import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../../../services/authenticate";
import {ShiftActions} from "../../../../R/sales/shifts/shift.actions";
import {FormValidationService} from "../../../../../../share/provider/form-validation";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ShiftDetailActions} from "../../../../R/sales/shifts/detail/detail.actions";
import {ShiftState} from "../../../../R/sales/shifts/shift.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-popup-open',
             templateUrl: 'open.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsPopupOpenComponent implements OnInit {
  @Input() shiftState: ShiftState;
  protected _data = {
    startMoney: 0,
    note: ''
  };
  
  constructor(protected authenticate: AuthenticateService,
              protected shiftActions: ShiftActions,
              protected formValidation: FormValidationService,
              protected notify: NotifyManager,
              protected shiftDetailActions: ShiftDetailActions) { }
  
  ngOnInit() {
    if (this.shiftState.lastShift) {
      this._data.startMoney = this.shiftState.lastShift['total_counted_amount'] - this.shiftState.lastShift['take_out_amount'];
    }
  }
  
  cancel() {
    this.formValidation.cancel('popup-open-shift', () => {
      this.shiftActions.changeStatePopup(null);
    })
  }
  
  openShift() {
    if (this.authenticate.userCan('open_and_close_register')) {
      this.formValidation.submit('popup-open-shift', () => {
        this.shiftDetailActions.openShift(this._data);
      }, true)
    } else {
      this.notify.warning("not_have_permission_to_close_shift");
    }
  }
}
