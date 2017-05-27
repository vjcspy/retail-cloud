/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import {AppState} from "./app.service";

/**
 * App Component
 * Top Level Component
 */
@Component({
             selector: "app",
             encapsulation: ViewEncapsulation.None,
             styleUrls: [
               "./app.component.css",
               "../../node_modules/materialize-css/dist/css/materialize.min.css",
               "../../node_modules/nprogress/nprogress.css"
             ],
             template: `
               <router-outlet></router-outlet>
             `
           })
export class AppComponent implements OnInit {
  constructor(public appState: AppState) {}

  public ngOnInit() {
    console.log("Initial App State", this.appState.state);
  }
}
