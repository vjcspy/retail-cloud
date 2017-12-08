import {Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {ReportDashboardHelper} from "../../R/dashboard/helper";
import {DashboardReportService} from "../../R/dashboard/service";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";
import * as _ from "lodash";

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [
               './dashboard.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })


export class DashboardPage extends AbstractRxComponent implements OnInit {
  constructor(protected dashboardReportService: DashboardReportService ,protected changeDetector: ChangeDetectorRef) {
    super();
    dashboardReportService.getDashboardReport();
  }
  
  ngOnInit() {
    this.changeDetector.detach();
    this._subscription['change_base_url']  =  this.dashboardReportService.getChangeBaseUrlStream().subscribe(() => {
      this.dashboardReportService.getDashboardReport();
    });
    
    this._subscription['update_view']  =  this.dashboardReportService.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
  
  trackByValue(index, measure) {
    return measure;
  }

  getDataFilter() {
    return this.dashboardReportService.viewDataFilter;
  }
  
  getScopeValue() {
    return this.dashboardReportService.viewDataFilter['scope'];
  }
  
  getPeriodValue() {
    return this.dashboardReportService.viewDataFilter['period'];
  }
  
  changeScopeValue(scope) {
    if (scope !== this.getScopeValue()) {
      this.dashboardReportService.viewDataFilter['scope'] = scope;
      this.dashboardReportService.getDashboardReport();
    }
  }
  
  protected getListScope() {
    return ReportDashboardHelper.getListScope();
  }
  
  protected getListTypeChart() {
    return ReportDashboardHelper.getWidgets();
  }
  
  protected getViewData(widget = null){
    if(widget != null){
      let data = _.find(this.dashboardReportService.viewData['items'], (row) => { return row['type'] === widget; })
      // console.log(_.find(this.dashboardReportService.viewData['items'], (row) => { return row['type'] === widgets; }));
      // return this.dashboardReportService.viewData;
      return data;
    }
    return this.dashboardReportService.viewData;
  }
  
}
