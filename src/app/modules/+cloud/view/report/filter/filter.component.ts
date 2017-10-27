import {Component, Input} from '@angular/core';
import * as _ from "lodash";
import {SaleReportService} from "../../../R/report/service";

@Component({
             // moduleId: module.id,
             selector: 'report-filter',
             templateUrl: 'filter.component.html'
           })
export class ReportFilterComponent {
  @Input('report_type') report_type: string;
  
  constructor(protected saleReportService: SaleReportService) { }
  
  trackByValue(index, measure) {
    return measure;
  }
  
  checkSummaryType() {
    return (this.report_type == 'sales_summary') ? 1 : 0;
  }
  
  checkTypeFilterBasedReportType() {
    let report_type = this.saleReportService.viewDataFilter['report_type'];
    if (_.indexOf(['order_status', 'day_of_week', 'hour'], report_type) == -1)
      return true;
  }
}
