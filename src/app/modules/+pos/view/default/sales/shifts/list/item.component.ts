import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-list-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsListItemComponent implements OnInit {
  @Input() shift;
  
  constructor() { }
  
  ngOnInit() { }
  
}
