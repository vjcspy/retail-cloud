import {ChangeDetectionStrategy, Component} from '@angular/core';
import {posReducer} from "./R/index";
import {OfflineService} from "../share/provider/offline";
import {ReducerManagement} from "../../services/reducer-management";
import {NotifyManager} from "../../services/notify-manager";
import {AppService} from "../../app.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosComponent {
  constructor(private reducerManagement: ReducerManagement,
              private offline: OfflineService,
              protected appService: AppService,
              protected translate: TranslateService,
              private notify: NotifyManager) {
    this.translate.use('en');
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
    console.log('%c POS v1.0.1.201802091710 ', 'background: #222; color: #bada55');
  }
}
