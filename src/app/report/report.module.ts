import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgModule, ApplicationRef} from '@angular/core';
// declarations :
import {DashboardReportComponent} from "./dashboard/dashboard.report";
import {SalesReportComponent} from "./sales/sales.report";
// import module
import {RouterModule} from '@angular/router';
import {ROUTES} from './report.routes';
import {AppState} from "../app.service";
import {RequestService} from "./service/request";
import {ApiService} from "./service/api.service";
import {ReportSelectComponent} from "./elements/select.component";



@NgModule({
              declarations: [
                  // Components / Directives/ Pipes
                  DashboardReportComponent,
                  SalesReportComponent,

                  ReportSelectComponent,
              ],
              imports: [
                  CommonModule,
                  FormsModule,
                  RouterModule.forChild(ROUTES)
              ],
              providers: [
                  ApiService, RequestService
              ]
          })
export class ReportModule {
    constructor(public appRef:ApplicationRef,
                public appState:AppState) {
    }

}
