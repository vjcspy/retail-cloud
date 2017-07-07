import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../../../services/authenticate";
import {ShiftActions} from "../../../../R/sales/shifts/shift.actions";
import {FormValidationService} from "../../../../../../share/provider/form-validation";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ShiftDetailActions} from "../../../../R/sales/shifts/detail/detail.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-popup-open',
             templateUrl: 'open.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsPopupOpenComponent implements OnInit {
  protected _data = {
    startMoney: 0,
    note: ''
  };
  
  constructor(protected authenticate: AuthenticateService,
              protected shiftActions: ShiftActions,
              protected formValidation: FormValidationService,
              protected notify: NotifyManager,
              protected shiftDetailActions: ShiftDetailActions) { }
  
  ngOnInit() { }
  
  cancel() {
    this.formValidation.cancel('popup-open-shift', () => {
      this.shiftActions.changeStatePopup(null);
    })
  }
  
  openShift() {
    if (this.authenticate.userCan('open_and_close_register')) {
      this.formValidation.submit('popup-open-shift', () => {
        this.shiftDetailActions.openShift(this._data);
      },true)
    } else {
      this.notify.warning("not_have_permession_to_close_shift");
    }
  }
}
