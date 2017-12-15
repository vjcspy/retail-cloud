/**
 * Angular 2 decorators and services
 */
import {
  ChangeDetectionStrategy,
  Component, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AbstractSubscriptionComponent} from "./code/AbstractSubscriptionComponent";
import {RetailTranslate} from "./modules/share/provider/retail-translate";
import {AuthenticateService} from "./services/authenticate";

/**
 * App Component
 * Top Level Component
 */
@Component({
             selector: 'app',
             encapsulation: ViewEncapsulation.None,
             styleUrls: [
               './app.component.css',
               '../../node_modules/bootstrap/dist/css/bootstrap.css',
               '../../node_modules/font-awesome/css/font-awesome.min.css',
               '../../node_modules/ionicons/css/ionicons.css',
               '../../node_modules/ng2-toastr/ng2-toastr.css',
               '../../node_modules/select2/dist/css/select2.min.css',
               '../../node_modules/select2-bootstrap-theme/dist/select2-bootstrap.min.css',
               '../../node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
               '../../node_modules/bootstrap-daterangepicker/daterangepicker.css',
               '../../node_modules/ladda/dist/ladda.min.css',
               '../../node_modules/animate.css/animate.min.css',
               '../assets/icon/icomoon/style.css',
             ],
             template: `
               <router-outlet></router-outlet>
             `,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent extends AbstractSubscriptionComponent {
  constructor(private toastr: ToastsManager,
              vcr: ViewContainerRef,
              protected translate: TranslateService,
              private retailTranslate: RetailTranslate,
              private authenticate: AuthenticateService) {
    super();
    this.resolveLanguage();
    this.toastr.setRootViewContainerRef(vcr);
    this.authenticate.subscribeAccountChange();
  }
  
  protected resolveLanguage() {
    this.retailTranslate.resolveLanguages();
  }
}
