import {Component, Input, OnInit} from '@angular/core';
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {ShiftState} from "../../../R/sales/shifts/shift.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-list',
             templateUrl: 'list.component.html'
           })
export class PosDefaultSalesShiftsListComponent implements OnInit {
  @Input() shiftState: ShiftState;
  @Input() posQuoteState: PosQuoteState;
  
  constructor(public menuLeftActions: MenuLeftActions) { }
  
  ngOnInit() { }
  
}
