import {ChangeDetectionStrategy, Component} from '@angular/core';
import {OfflineService} from "../share/provider/offline";
import {RetailTranslate} from "../../services/retail-translate";
import {TranslateService} from "@ngx-translate/core";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosComponent {
  constructor(private offline: OfflineService, private retailTranslate: RetailTranslate, private translate: TranslateService) {
    this.offline.init();
    
    this.translate.setDefaultLang('en');
    this.translate.use('vi');
    // this.retailTranslate.resolveLanguages();
  }
}
