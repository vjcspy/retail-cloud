import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'cashiers-component',
             templateUrl: 'cashiers.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CashiersComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
