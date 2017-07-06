import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ShiftState} from "../../../R/sales/shifts/shift.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftDetailComponent {
  @Input() shiftState: ShiftState;
  
  shiftIsOpening() {
    return parseInt(this.shiftState.detail.shift['is_open']) === 1;
  }
}
