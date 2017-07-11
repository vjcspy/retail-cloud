import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SHIFT_POPUP, ShiftState} from "../../../R/sales/shifts/shift.state";
import {ShiftActions} from "../../../R/sales/shifts/shift.actions";
import {ShiftDetailService} from "../../../R/sales/shifts/detail/detail.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftDetailComponent {
  @Input() shiftState: ShiftState;
  
  constructor(private shiftActions: ShiftActions, private shiftDetailService: ShiftDetailService) {}
  
  shiftIsOpening() {
    return parseInt(this.shiftState.detail.shift['is_open']) === 1;
  }
  
  closeShift() {
    this.shiftActions.changeStatePopup(SHIFT_POPUP.CLOSE_POPUP);
  }
  
  adjustShift() {
    this.shiftActions.changeStatePopup(SHIFT_POPUP.ADJUST_POPUP);
  }
  
  printShiftReport() {
    this.shiftDetailService.printShiftReport();
  }
}
