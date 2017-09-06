/**
 * Angular 2 decorators and services
 */
import {
  Component, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {TranslateService} from "@ngx-translate/core";
import {RetailTranslate} from "./services/retail-translate";
import {AbstractSubscriptionComponent} from "./code/AbstractSubscriptionComponent";

/**
 * App Component
 * Top Level Component
 */
@Component({
             selector: 'app',
             encapsulation: ViewEncapsulation.None,
             styleUrls: [
               './app.component.css'
             ],
             template: `
               <router-outlet></router-outlet>
             `
           })
export class AppComponent extends AbstractSubscriptionComponent {
  constructor(private toastr: ToastsManager,
              vcr: ViewContainerRef,
              protected translate: TranslateService,
              private retailTranslate: RetailTranslate) {
    super();
    this.resolveLanguage();
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  protected resolveLanguage() {
    if (this.retailTranslate.getCurrentLanguage()) {
      let usedLang = this.retailTranslate.getCurrentLanguage();
      if (usedLang) {
        this.translate.use(usedLang);
      } else {
        this.translate.use('en');
      }
      this.translate.setDefaultLang('en');
    }
  }
}
