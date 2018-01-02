import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";
import {count} from "rxjs/operator/count";
import {DashboardReportService} from "../../../R/dashboard/service";
import {AbstractRxComponent} from "../../../../share/core/AbstractRxComponent";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-groupChart',
             templateUrl: 'retail-dashboard-groupChart.html',
             styleUrls: [
               './retail-dashboard-groupChart.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class RetailDashboardGroupChart extends AbstractRxComponent implements OnInit {
  
  
  constructor(protected dashboardReportService: DashboardReportService, protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this._subscription['update_view']  =  this.dashboardReportService.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
  
  protected getListTypeChart() {
    return ReportDashboardHelper.getWidgets();
  }
  
  getCurrentCurrency() {
    if (this.dashboardReportService.viewData.hasOwnProperty('current_currency')) {
      return this.dashboardReportService.viewData['current_currency'];
    }
    return "$";
  }
  
  getPeriodValue() {
    return this.dashboardReportService.viewDataFilter['period'];
  }
  
  protected getViewData(widget = null) {
    if (widget != null) {
      let data = _.find(this.dashboardReportService.viewData['items'], (row) => { return row['type'] === widget; })
      return data;
    }
    return this.dashboardReportService.viewData;
  }
  
}
