import {Component, Input} from '@angular/core';
import * as _ from "lodash";
import {SaleReportService} from "../../../R/report/service";
import {ReportHelper} from "../../../R/report/helper";
import {FormValidationService} from "../../../../share/provider/form-validation";

@Component({
             // moduleId: module.id,
             selector: 'report-filter',
             templateUrl: 'filter.component.html'
           })
export class ReportFilterComponent {
  @Input('report_type') report_type: string;
  
  constructor(protected saleReportService: SaleReportService,
              protected formValidation: FormValidationService) { }
  
  trackByValue(index, measure) {
    return measure;
  }
  
  applyFilter(force: boolean = false){
    this.formValidation.submit('report-filter', async () => {
      this.saleReportService.getSaleReport(force);
    }, true);
  }
  
  checkSummaryType() {
    return (this.report_type == 'sales_summary') ? 1 : 0;
  }
  
  checkTypeFilterBasedReportType() {
    let report_type = this.saleReportService.viewDataFilter['report_type'];
    if (_.indexOf(['order_status', 'day_of_week', 'hour'], report_type) == -1)
      return true;
  }
  
  getOptionForFilter() {
    let report_type = this.saleReportService.viewDataFilter['report_type'];
    if (report_type == 'order_status')
      return ReportHelper.getListOrderStatus();
    else if (report_type == 'day_of_week')
      return ReportHelper.getListDayOfWeek();
    else
      return ReportHelper.getListHour();
  }
  
  getLabelForTitle(){
    let report_type = this.saleReportService.viewDataFilter['report_type'];
    let reportColumn     = _.find(ReportHelper.getListReportType()['data'], (row) => row['value'] == report_type);
    return reportColumn['label'];
  }
}
