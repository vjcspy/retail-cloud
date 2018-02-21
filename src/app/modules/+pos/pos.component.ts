import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {posReducer} from "./R/index";
import {OfflineService} from "../share/provider/offline";
import {ReducerManagement} from "../../services/reducer-management";
import {NotifyManager} from "../../services/notify-manager";
import {AppService} from "../../app.service";
import {TranslateService} from "@ngx-translate/core";
import {AbstractSubscriptionComponent} from "../../code/AbstractSubscriptionComponent";
import {AccountService} from "../../R/account/account.service";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(private reducerManagement: ReducerManagement,
              private offline: OfflineService,
              protected appService: AppService,
              protected translate: TranslateService,
              private notify: NotifyManager,
              private accountService: AccountService) {
    super();
    this.translate.use('en');
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
    console.log('%c POS v1.0.1.201802091710 ', 'background: #222; color: #bada55');
  }
  ngOnInit() {
    this.subscribeObservable('permission', () => this.accountService.subscribePermission(true));
  }
}
