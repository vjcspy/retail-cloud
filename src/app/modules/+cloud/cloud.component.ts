import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AbstractSubscriptionComponent} from "../../code/AbstractSubscriptionComponent";
import {AccountService} from "../../R/account/account.service";

@Component({
             // moduleId: module.id,
             selector: 'cloud-component',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CloudComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(private accountService: AccountService) {
    //new report
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable('urls', () => this.accountService.subscribeLicense(true));
  }
}
