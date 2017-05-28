/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit, ViewContainerRef,
  ViewEncapsulation
} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "./R/index";
import {RootState} from "./R/root.state";
import {ToastsManager} from "ng2-toastr";

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
               "../../node_modules/ng2-toastr/ng2-toastr.css"
             ],
             template: `
               <router-outlet></router-outlet>
               <ngrx-store-log-monitor toggleCommand="ctrl-h" positionCommand="ctrl-m"></ngrx-store-log-monitor>
             `
           })
export class AppComponent implements OnInit {
  protected rootState;
  
  constructor(private store: Store<AppState>, private toastr: ToastsManager, vcr: ViewContainerRef) {
    this.rootState = this.store.select('rootState');
    this.toastr.setRootViewContainerRef(vcr);
  }
  
  public ngOnInit() {
    this.toastr.success('You are awesome!', 'Success!');
    this.rootState.subscribe((state: RootState) => {console.log(state); });
  }
}
