import {Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {ReportDashboardHelper} from "../../R/dashboard/helper";
import {DashboardReportService} from "../../R/dashboard/service";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";
import * as _ from "lodash";
import * as moment from "moment";
@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [
               './dashboard.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })


export class DashboardPage extends AbstractRxComponent implements OnInit {
  public granularity: string;
  constructor(protected dashboardReportService: DashboardReportService ,protected changeDetector: ChangeDetectorRef) {
    super();
    dashboardReportService.getDashboardReport();
    changeDetector.detach();
  }
  
  ngOnInit() {
    this.initDefaultGranularity(this.getPeriodValue());
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
      this.dashboardReportService.viewState['isOverLoad'] = false;
      this.changeDetector.detectChanges();
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
      return data;
    }
    return this.dashboardReportService.viewData;
  }
  
  // xu ly date time trong dashboard page
  initDefaultGranularity(period, change_granularity = 0) {
    let end_date = this.getEndTimePeriod();
    let start_date = this.getStartTimePeriod();
    
    switch (period) {
      case '7d':
        end_date = moment(end_date, "Do MMM YYYY").add(change_granularity, 'days').format("Do MMM YYYY");
        this.setEndTimePeriod(end_date);
        this.setStartTimePeriod(end_date);
        this.granularity = end_date;
        break;
      case '6w':
        end_date = moment(start_date, "Do MMM YYYY").add(change_granularity, 'weeks').endOf("week").format("Do MMM YYYY");
        if (moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'year') &&
            moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'month') &&
            moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'day')
        )
          end_date = moment().format("Do MMM YYYY");
        start_date = moment(start_date, "Do MMM YYYY").startOf('week').add(change_granularity, 'weeks').format("Do MMM YYYY");
        this.setEndTimePeriod(end_date);
        this.setStartTimePeriod(start_date);
        this.granularity = start_date + ' - ' + end_date;
        break;
      case '6m':
        end_date = moment(start_date, "Do MMM YYYY").add(change_granularity, 'months').endOf("month").format("Do MMM YYYY");
        if (moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'year') &&
            moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'month') &&
            moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'day')
        )
          end_date = moment().format("Do MMM YYYY");
        start_date = moment(start_date, "Do MMM YYYY").startOf('month').add(change_granularity, 'months').format("Do MMM YYYY");
        this.setEndTimePeriod(end_date);
        this.setStartTimePeriod(start_date);
        this.granularity = start_date + ' - ' + end_date;
        break;
      default:
        this.granularity = moment().add(change_granularity, 'days').format("Do MMM YYYY");
        break;
    }
  }
  
  getStartTimePeriod() {
    return this.dashboardReportService.viewDataFilter['dateStart'];
  }
  
  getEndTimePeriod() {
    return this.dashboardReportService.viewDataFilter['dateEnd'];
  }
  
  setStartTimePeriod(dateStart) {
    return this.dashboardReportService.viewDataFilter['dateStart'] = dateStart;
  }
  
  setEndTimePeriod(dateEnd) {
    return this.dashboardReportService.viewDataFilter['dateEnd'] = dateEnd;
  }
  
  setGranularity(period, change_granularity = null) {
    if (period !== this.getPeriodValue() || !_.isEmpty(change_granularity)) {
      this.dashboardReportService.viewDataFilter['period'] = period;
      change_granularity = ReportDashboardHelper.getValueNextPrevGranularity(change_granularity);
      
      let end_date = this.getEndTimePeriod();
      if (change_granularity === ReportDashboardHelper.NEXT_GRANULARITY &&
          moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'year') &&
          moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'month') &&
          moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'day')
      ) {
        return;
      } else {
        this.initDefaultGranularity(period, change_granularity);
      }
      this.dashboardReportService.viewState['isOverLoad'] = false;
      this.changeDetector.detectChanges();
      this.dashboardReportService.getDashboardReport();
    }
  }
  
  protected getListTimePeriodPicker() {
    return ReportDashboardHelper.getListTimePeriodPicker();
  }
  
  canShiftUp(): boolean {
    let end_date = this.getEndTimePeriod();
    if (moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'year') &&
        moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'month') &&
        moment(end_date, "Do MMM YYYY").isSameOrAfter(moment(), 'day')
    ) {
      return false;
    } else {
      return true;
    }
  }
  
  isOverLoad(){
    return this.dashboardReportService.viewState['isOverLoad'];
  }
  
  protected getProductTrend() {
    return this.dashboardReportService.viewData;
  }
  
  getCurrentCurrency() {
    if (this.dashboardReportService.viewData.hasOwnProperty('current_currency')) {
      return this.dashboardReportService.viewData['current_currency'];
    }
    return "$";
  }
  
}
