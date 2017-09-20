import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SHIFT_POPUP, ShiftState} from "../../../R/sales/shifts/shift.state";
import {ShiftActions} from "../../../R/sales/shifts/shift.actions";
import {ShiftDetailService} from "../../../R/sales/shifts/detail/detail.service";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftDetailComponent {
  @Input() shiftState: ShiftState;
  
  constructor(private shiftActions: ShiftActions,
              protected notify: NotifyManager,
              public authenticateService: AuthenticateService,
              private shiftDetailService: ShiftDetailService) {}
  
  shiftIsOpening() {
    return parseInt(this.shiftState.detail.shift['is_open']) === 1;
  }
  
  closeShift() {
    if (this.authenticateService.userCan('open_and_close_register')) {
      this.shiftActions.changeStatePopup(SHIFT_POPUP.CLOSE_POPUP);
    } else {
      this.notify.error("not_have_permission_to_close_shift");
    }
  }
  
  adjustShift() {
    if (this.authenticateService.userCan('make_adjustment_on_register')) {
      this.shiftActions.changeStatePopup(SHIFT_POPUP.ADJUST_POPUP);
    } else {
      this.notify.error("not_have_permission_to_make_adjustment_on_shift");
    }
  }
  
  printShiftReport() {
    this.shiftDetailService.printShiftReport();
  }

}
