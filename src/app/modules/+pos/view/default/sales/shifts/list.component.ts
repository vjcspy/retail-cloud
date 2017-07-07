import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {SHIFT_POPUP, ShiftState} from "../../../R/sales/shifts/shift.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {ShiftActions} from "../../../R/sales/shifts/shift.actions";
import {ShiftListActions} from "../../../R/sales/shifts/list/list.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsListComponent implements OnInit {
  @Input() shiftState: ShiftState;
  @Input() posQuoteState: PosQuoteState;
  
  constructor(public menuLeftActions: MenuLeftActions,
              protected shiftActions: ShiftActions,
              protected shiftListActions: ShiftListActions) { }
  
  ngOnInit() { }
  
  openShiftPopup() {
    this.shiftActions.changeStatePopup(SHIFT_POPUP.OPEN_POPUP);
  }
  
  loadMoreShift() {
    if (!this.shiftState.list.isLoadingFromServer) {
      this.shiftListActions.loadMoreShift();
    }
  }
}
