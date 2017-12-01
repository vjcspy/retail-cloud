import {Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {ReportDashboardHelper} from "../../R/dashboard/helper";
import {DashboardReportService} from "../../R/dashboard/service";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [
               './dashboard.scss'
             ],
           })


export class DashboardPage extends AbstractRxComponent implements OnInit {
  constructor(protected dashboardReportService: DashboardReportService ,protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this._subscription['change_base_url']  =  this.dashboardReportService.getChangeBaseUrlStream().subscribe(() => {
      this.dashboardReportService.getDashboardReport();
    });
    
    this._subscription['update_view']  =  this.dashboardReportService.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  getDataFilter() {
    return this.dashboardReportService.viewDataFilter;
  }
  
  protected getListTimePeriodPicker() {
    let data = [
      {id: 1, label: "Day", value: "day"},
      {id: 2, label: "Week", value: "week"},
      {id: 3, label: "Month", value: "month"}
    ];
    return {
      data: data,
      isMultiSelect: false,
      label: "Time Period Picker",
      value: "time_period_picker"
    }
  }
  
  protected getListScope() {
    return ReportDashboardHelper.getListScope();
  }
  
  protected getListTypeChart() {
    return ReportDashboardHelper.getWidgets();
  }
  
  protected getViewData(){
    return this.dashboardReportService.viewData;
  }
  
}
