/**
 * Angular 2 decorators and services
 */
import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import {ToastsManager} from "ng2-toastr";
import {AbstractSubscriptionComponent} from "./code/AbstractSubscriptionComponent";
import {DialogService} from "./modules/dialog/dialog.service";
import {RetailTranslate} from "./modules/share/provider/retail-translate";
import {AppService} from "./app.service";

/**
 * App Component
 * Top Level Component
 */
@Component({
             selector: "app",
             encapsulation: ViewEncapsulation.None,
             styleUrls: [
               "./app.component.css",
               "../../node_modules/bootstrap/dist/css/bootstrap.min.css",
               '../../node_modules/ladda/dist/ladda.min.css',
               "../../node_modules/nprogress/nprogress.css",
               "../../node_modules/ng2-toastr/ng2-toastr.css",
               '../../node_modules/select2/dist/css/select2.css',
               '../../node_modules/froala-editor/css/froala_editor.pkgd.min.css',
               '../../node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.min.css'
             ],
             template: `
               <router-outlet></router-outlet>
             `,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent extends AbstractSubscriptionComponent {
  constructor(private toastr: ToastsManager,
              vcr: ViewContainerRef,
              protected translate: RetailTranslate,
              protected changedetector: ChangeDetectorRef,
              private dialogService: DialogService,) {
    super();
    this.resolveLanguage();
    this.dialogService.setRootViewContainerRef(vcr);
    this.toastr.setRootViewContainerRef(vcr);
    AppService.$changeDetector = this.changedetector;
  }
  
  protected resolveLanguage() {
    this.translate.resolveLanguages();
  }
}
