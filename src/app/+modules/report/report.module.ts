import {NgModule, OnInit} from '@angular/core';

import {DashboardPage} from "./pages/dashboard/dashboard";
import {DashboardWidgetComponent} from "./pages/dashboard/widget/dashboard-widget.component";
import {RouterModule} from "@angular/router";
import {ROUTES} from "./report.routes";
import {CloudModule} from "../../cloud/cloud.module";
import {ReportSalesContainer} from "./pages/sales/sales-container";
import {ReportSalesAdvancedPage} from "./pages/sales/pages/advanced";
import {R_REPORT_IMPORTS, R_REPORT_PROVIDERS} from "./R/index";
import {ReportContainer} from "./report-container";

const REPORT_COMPONENTS = [
  ReportContainer,
  DashboardPage,
  DashboardWidgetComponent,
  
  ReportSalesContainer,
  ReportSalesAdvancedPage
];

@NgModule({
            imports: [
              CloudModule,
              RouterModule.forChild(ROUTES),
              ...R_REPORT_IMPORTS
            ],
            exports: [],
            declarations: [...REPORT_COMPONENTS],
            providers: [
              ...R_REPORT_PROVIDERS
            ],
          })
export class ReportModule {

}
