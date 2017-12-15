import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import * as _ from "lodash";
import {SaleReportService} from "../../../R/report/service";
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import {DashboardReportService} from "../../../R/dashboard/service";
import {Router} from "@angular/router";
import * as moment from "moment";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-table-topUser',
             templateUrl: 'retail-dashboard-table-user.html',
             styleUrls: [
               './retail-dashboard-table-user.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class RetailDashboardTableUser implements OnInit {
  @Input('data_view') data_view = [];
  
  isSortAsc: boolean;
  
  constructor(protected changeDetector: ChangeDetectorRef,
              protected saleReportService: SaleReportService,
              protected reportDashBoardService: DashboardReportService,
              private router: Router) {
    this.isSortAsc = true;
  }
  
  checkDataNullForHidden() {
    if (this.data_view.length == 0) {
      return true;
    } else
      return false;
  }
  
  ngOnInit() {
    this.resoveSoftData();
  };
  
  sortRevenue(): void {
    this.isSortAsc = !this.isSortAsc;
    this.resoveSoftData();
  }
  
  resoveSoftData() {
    let listDataSoft = _.sortBy(this.data_view, [(item) => {
      return parseFloat(item['revenue']);
    }]);
    if (this.isSortAsc) {
      //noinspection TypeScriptUnresolvedFunction
      listDataSoft = _.reverse(listDataSoft);
    }
    this.data_view = listDataSoft;
    this.changeDetector.detectChanges();
  }
  
  sortItem() {
    if (this.isSortAsc === false) {
      return "datatable-sorting-down";
    }
    return "datatable-sorting-up";
  }
  
  goToSaleReport() {
    this.saleReportService.viewDataFilter['report_type']   = 'user';
    this.saleReportService.viewDataFilter['dateTimeState'] = 'compare';
    this.saleReportService.viewDataFilter['compare_value'] = this.getCompareValueSaleReport();
    this.saleReportService.viewDataFilter['compare_type']  = 'last_from';
    this.saleReportService.viewDataFilter['compare_count'] = 1;
    this.saleReportService.viewDataFilter['compare_from']  = moment(this.reportDashBoardService.viewDataFilter['dateStart'], "Do MMM YYYY");
    this.initDateRangeForSaleReport();
    
    this.router.navigate(['/cloud/default/sale-report']);
  }
  
  getCompareValueSaleReport() {
    let period     = this.reportDashBoardService.viewDataFilter['period'];
    let periodData = _.find(ReportDashboardHelper.getListTimePeriodPicker()['data'], (row) => row['value'] === period);
    return periodData['for_sale_report'];
  }
  
  initDateRangeForSaleReport() {
    this.saleReportService.viewDataFilter['dateStart'] = moment(this.reportDashBoardService.viewDataFilter['dateStart'], "Do MMM YYYY").format('YYYY-MM-DD 00:00:00');
    this.saleReportService.viewDataFilter['dateEnd'] = moment(this.reportDashBoardService.viewDataFilter['dateEnd'], "Do MMM YYYY").format('YYYY-MM-DD 23:59:59');
  }
}
