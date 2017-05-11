import {Routes} from "@angular/router";
import {NotFoundPage} from "./code/angular/components/not-found";

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/report',
    pathMatch: 'full'
  },
  {path: 'report', loadChildren: './+modules/report#ReportModule'},
  {path: '**', component: NotFoundPage}
];
