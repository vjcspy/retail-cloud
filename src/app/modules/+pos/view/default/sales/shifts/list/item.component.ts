import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ShiftListActions} from "../../../../R/sales/shifts/list/list.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-list-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsListItemComponent implements OnInit {
  @Input() shift;
  
  constructor(public shiftListActions: ShiftListActions) { }
  
  ngOnInit() { }
  
}
