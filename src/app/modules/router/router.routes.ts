import {Routes} from "@angular/router";

export const ROUTES: Routes = [
  {path: 'pos', loadChildren: '../+pos#PosModule', data: {preload: true}}
];
