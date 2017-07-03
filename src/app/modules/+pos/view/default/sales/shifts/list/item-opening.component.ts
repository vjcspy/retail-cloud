import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-list-item-opening',
             templateUrl: 'item-opening.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsListItemOpeningComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
