import {NgModule} from '@angular/core';
import {ShareModule} from "../share/share.module";
import {CloudReportTextComponent} from "./components/text.component";
import {CloudReportSelectMultiComponent} from "./components/select_multi.component";
import {CloudReportSelectComponent} from "./components/select.component";
import {ReportSelect2Component} from "./components/report-select2.component";
import {CloudReportInputNumberComponent} from "./components/input-number.component";
import {GoTopButton} from "./components/go-top-button.component";
import {CloudReportDateCompareItemComponent} from "./components/date-compare-item.component";
import {CloudReportTimeSelectComponent} from "./components/report-time-select.component";

@NgModule({
            imports: [
              ShareModule
            ],
            exports: [
              CloudReportTextComponent,
              CloudReportSelectMultiComponent,
              CloudReportSelectComponent,
              ReportSelect2Component,
              CloudReportInputNumberComponent,
              GoTopButton,
              CloudReportDateCompareItemComponent,
              CloudReportTimeSelectComponent
            ],
            declarations: [
              CloudReportTextComponent,
              CloudReportSelectMultiComponent,
              CloudReportSelectComponent,
              ReportSelect2Component,
              CloudReportInputNumberComponent,
              GoTopButton,
              CloudReportDateCompareItemComponent,
              CloudReportTimeSelectComponent
            ],
          })
export class ReportElementModule {
}
