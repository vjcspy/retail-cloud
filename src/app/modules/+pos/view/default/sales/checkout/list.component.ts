import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutListComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
