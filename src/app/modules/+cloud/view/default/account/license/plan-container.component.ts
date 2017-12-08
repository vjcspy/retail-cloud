import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'account-license-plan-container',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicensePlanContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
