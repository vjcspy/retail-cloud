import {ChangeDetectionStrategy, Component} from '@angular/core';
import {posReducer} from "./R/index";
import {OfflineService} from "../share/provider/offline";
import {ReducerManagement} from "../../services/reducer-management";
import {NotifyManager} from "../../services/notify-manager";
import {AppService} from "../../app.service";

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
              private notify: NotifyManager) {
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
    console.log('%c POS v1.0.1.891633 ', 'background: #222; color: #bada55');
  }
}
