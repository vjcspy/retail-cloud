import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'account-license-container',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseContainerComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
