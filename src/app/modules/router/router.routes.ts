import {Routes} from "@angular/router";

export const ROUTES: Routes = [
  {path: 'cloud', loadChildren: '../+cloud#CloudModule', data: {preload: true}}
];
