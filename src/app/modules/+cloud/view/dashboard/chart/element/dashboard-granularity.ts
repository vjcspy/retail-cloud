import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as _ from "lodash";
import * as moment from "moment";
import {DashboardReportService} from "../../../../R/dashboard/service";
import {AbstractRxComponent} from "../../../../../share/core/AbstractRxComponent";
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";

@Component({
             // moduleId: module.id,
             selector: 'dashboard-granularity',
             templateUrl: 'dashboard-granularity.html',
             styleUrls: [
               './dashboard-granularity.scss'
             ],
           })

export class DashboardGranularity extends AbstractRxComponent implements OnInit {
  public granularity: string;
  
  constructor(protected dashboardReportService: DashboardReportService,
              protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this.initDefaultGranularity(this.getPeriodValue());
  }
  
  initDefaultGranularity(period, change_granularity = 0) {
    let end_date = this.getEndTimePeriod();
    let start_date = this.getStartTimePeriod();
    
    switch (period) {
      case '7d':
        end_date = moment(end_date, "Do MMM YYYY").add(change_granularity, 'days').format("Do MMM YYYY");
        this.setEndTimePeriod(end_date);
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
  
  getPeriodValue() {
    return this.dashboardReportService.viewDataFilter['period'];
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
  
}
