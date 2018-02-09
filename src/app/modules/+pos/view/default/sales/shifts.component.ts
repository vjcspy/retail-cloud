import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ShiftState} from "../../R/sales/shifts/shift.state";
import {Store} from "@ngrx/store";
import {PosQuoteState} from "../../../R/quote/quote.state";
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosGeneralState} from "../../../R/general/general.state";
import {TutorialService} from "../../../modules/+tutorial/tutorial.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts',
             templateUrl: 'shifts.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsComponent implements OnInit {
  shiftState$: Observable<ShiftState>;
  posQuoteState$: Observable<PosQuoteState>;
  generalState$: Observable<PosGeneralState>;
  
  constructor(private store$: Store<any>, private tourService: TutorialService) {
    this.shiftState$    = this.store$.select('shifts');
    this.posQuoteState$ = this.store$.select('quote');
    this.generalState$  = this.store$.select('general');
  }
  
  ngOnInit() {
    setTimeout(() => {
      if (this.tourService.tour.getCurrentStep() === 9) {
        this.tourService.tour.resume();
        this.tourService.tour.goTo(10);
      }
    }, 100);
  }
  
}
