import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SHIFT_POPUP, ShiftState} from "../../../R/sales/shifts/shift.state";
import {PosGeneralState} from "../../../../R/general/general.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-popup',
             templateUrl: 'popup.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsPopupComponent implements OnInit {
  @Input() shiftState: ShiftState;
  
  constructor() { }
  
  ngOnInit() { }
  
  isOpeningShiftClosePopup() {
    return this.shiftState.popupOpening === SHIFT_POPUP.CLOSE_POPUP;
  }
  
  isOpeningShiftOpenPopup() {
    return this.shiftState.popupOpening === SHIFT_POPUP.OPEN_POPUP;
  }
}
