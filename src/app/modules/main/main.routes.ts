import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";

export const MAIN_ROUTES: Routes = [
  {path: '**', component: PageNotFound}
];
