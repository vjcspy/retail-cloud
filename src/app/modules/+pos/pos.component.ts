import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {posReducer} from "./R/index";
import {OfflineService} from "../share/provider/offline";
import {RetailTranslate} from "../../services/retail-translate";
import {TranslateService} from "@ngx-translate/core";
import {ReducerManagement} from "../../services/reducer-management";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`,
             encapsulation: ViewEncapsulation.None,
             styleUrls: ['../../../styles/pos.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosComponent {
  constructor(private reducerManagement: ReducerManagement, private offline: OfflineService, private retailTranslate: RetailTranslate, private translate: TranslateService) {
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
    
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    // this.retailTranslate.resolveLanguages();
  }
}
