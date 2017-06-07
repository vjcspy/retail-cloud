/**
 * Angular 2 decorators and services
 */
import {
  ChangeDetectionStrategy,
  Component, ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import {Store} from "@ngrx/store";
import {ToastsManager} from "ng2-toastr";
import {AppState} from "./R/index";

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
               "../../node_modules/nprogress/nprogress.css",
               "../../node_modules/ng2-toastr/ng2-toastr.css",
               "../../node_modules/font-awesome/scss/font-awesome.scss",
               // '../assets/css/font-awesome.scss',
               '../assets/css/daterangepicker.scss',
               '../assets/css/animate.css',
               '../assets/css/bootstrap-datetimepicker-standalone.css',
               '../assets/css/ion.rangeSlider.css',
               '../assets/css/ion.rangeSlider.skinNice.css',
               '../../node_modules/select2/dist/css/select2.css',
               '../../node_modules/ladda/dist/ladda.min.css'
             ],
             template: `
               <router-outlet></router-outlet>
               <!--<ngrx-store-log-monitor toggleCommand="ctrl-h" positionCommand="ctrl-m"></ngrx-store-log-monitor>-->
             `,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent {
  constructor(private toastr: ToastsManager, vcr: ViewContainerRef, private store: Store<AppState>) {
    this.toastr.setRootViewContainerRef(vcr);
    this.store.subscribe((appState) => window['appState'] = appState);
  }
  
}
