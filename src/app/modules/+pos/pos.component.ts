import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {posReducer} from "./R/index";
import {OfflineService} from "../share/provider/offline";
import {RetailTranslate} from "../../services/retail-translate";
import {TranslateService} from "@ngx-translate/core";
import {ReducerManagement} from "../../services/reducer-management";
import {NotifyManager} from "../../services/notify-manager";

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
              private notify: NotifyManager) {
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
  }
}
