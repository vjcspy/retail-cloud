import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts',
             templateUrl: 'shifts.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
