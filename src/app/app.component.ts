/**
 * Angular 2 decorators and services
 */
import {
  ChangeDetectionStrategy,
  Component, OnInit, ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import {ToastsManager} from "ng2-toastr";
import {AbstractSubscriptionComponent} from "./code/AbstractSubscriptionComponent";

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
               '../assets/css/font-awesome.scss',
               '../assets/css/daterangepicker.scss',
               '../assets/css/animate.css',
               '../assets/css/bootstrap-datetimepicker-standalone.css',
               '../assets/css/ion.rangeSlider.css',
               '../assets/css/ion.rangeSlider.skinNice.css',
               '../../node_modules/select2/dist/css/select2.css',
               '../../node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.min.css',
               // '../../node_modules/slick-carousel/slick/slick.css'
             ],
             template: `
               <router-outlet></router-outlet>
             `,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(private toastr: ToastsManager, vcr: ViewContainerRef) {
    super();
    
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  ngOnInit(): void {
  }
}
