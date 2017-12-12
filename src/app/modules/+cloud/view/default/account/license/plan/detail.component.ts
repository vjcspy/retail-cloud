import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'license-plan-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicensePlanDetailComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
