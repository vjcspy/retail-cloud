import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {SHIFT_POPUP, ShiftState} from "../../../R/sales/shifts/shift.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {ShiftActions} from "../../../R/sales/shifts/shift.actions";
import {ShiftListActions} from "../../../R/sales/shifts/list/list.actions";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {TutorialService} from "../../../../modules/+tutorial/tutorial.service";

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
              protected notify: NotifyManager,
              public authenticateService: AuthenticateService,
              protected shiftListActions: ShiftListActions,
              private tourService: TutorialService) { }
  
  ngOnInit() { }
  
  openShiftPopup() {
    if (this.authenticateService.userCan('open_and_close_register')) {
      this.shiftActions.changeStatePopup(SHIFT_POPUP.OPEN_POPUP);
      setTimeout(() => {
        this.tourService.tour.resume();
        this.tourService.tour.next();
      }, 100);
    } else {
      this.notify.error("not_have_permission_to_open_shift");
    }
  }
  
  loadMoreShift() {
    if (!this.shiftState.list.isLoadingFromServer) {
      this.shiftListActions.loadMoreShift();
    }
  }
  
  openLeftMenu() {
    this.tourService.tour.pause();
    this.menuLeftActions.changeOpenState(true);
  }
}
