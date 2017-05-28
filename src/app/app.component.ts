/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {Store} from "@ngrx/store";
import {AppState} from "./R/index";
import {RootState} from "./R/root.state";

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
               "../../node_modules/nprogress/nprogress.css"
             ],
             template: `
               <router-outlet></router-outlet>
               <ngrx-store-log-monitor toggleCommand="ctrl-h" positionCommand="ctrl-m"></ngrx-store-log-monitor>
             `
           })
export class AppComponent implements OnInit {
  protected rootState;
  
  constructor(private store: Store<AppState>) {
    this.rootState = this.store.select('rootState');
  }
  
  public ngOnInit() {
    this.rootState.subscribe((state: RootState) => {console.log(state); });
  }
}
