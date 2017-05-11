import {NgModule} from '@angular/core';

import {DashboardPage} from "./pages/dashboard/dashboard";
import {DashboardWidgetComponent} from "./pages/dashboard/widget/dashboard-widget.component";
import {RouterModule} from "@angular/router";
import {ROUTES} from "./report.routes";
import {CloudModule} from "../../cloud/cloud.module";

const REPORT_COMPONENTS = [
  DashboardPage,
  DashboardWidgetComponent
];

@NgModule({
            imports: [
              CloudModule,
              RouterModule.forChild(ROUTES)
            ],
            exports: [],
            declarations: [...REPORT_COMPONENTS],
            providers: [],
          })
export class ReportModule {
}
