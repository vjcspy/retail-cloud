import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AuthenticateService} from "../../../../../../../services/authenticate";
import {FormValidationService} from "../../../../../../share/provider/form-validation";
import {ShiftActions} from "../../../../R/sales/shifts/shift.actions";
import {ShiftDetailActions} from "../../../../R/sales/shifts/detail/detail.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ShiftState} from "../../../../R/sales/shifts/shift.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-popup-adjust',
             templateUrl: 'adjust.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsPopupAdjustComponent implements OnInit {
  @Input() shiftState: ShiftState;
  protected _data = {
    isIn: null,
    amount: 0,
    note: ''
  };
  
  constructor(protected authenticate: AuthenticateService,
              protected formValidation: FormValidationService,
              protected shiftActions: ShiftActions,
              protected shiftDetailActions: ShiftDetailActions,
              protected notify: NotifyManager) { }
  
  ngOnInit() { }
  
  cancel() {
    this.formValidation.cancel('popup-open-shift', () => {
      this.shiftActions.changeStatePopup(null);
    })
  }
  
  adjustShift() {
    if (this.authenticate.userCan('open_and_close_register')) {
      if (this._data.isIn === null) {
        this.notify.warning("please_define_action_when_adjust_shift");
        
        return;
      }
      this.formValidation.submit('popup-adjust-shift', () => {
        this.shiftDetailActions.adjustShift(this.shiftState.detail.shift, this._data);
      }, true)
    } else {
      this.notify.warning("not_have_permession_to_close_shift");
    }
  }
}
