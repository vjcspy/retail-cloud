import {Routes} from "@angular/router";
import {PageNotFound} from "./pages/404";

export const ROUTES: Routes = [
  {path: '**', component: PageNotFound}
];
