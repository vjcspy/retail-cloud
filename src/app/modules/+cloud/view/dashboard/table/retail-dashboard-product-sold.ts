import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";
import {SaleReportService} from "../../../R/report/service";
import {Router} from "@angular/router";
import {DashboardReportService} from "../../../R/dashboard/service";
import * as moment from "moment";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-table-product-trend',
             templateUrl: 'retail-dashboard-product-sold.html',
             styleUrls: [
               './retail-dashboard-product-sold.scss'
             ],
           })

export class RetailDashBoardTableProductSold {
  public sort_desc: boolean = true;
  public sort_measure: string = 'revenue';
  @Input('data_view') viewData  = [];
  
  constructor(protected changeDetector: ChangeDetectorRef,
              protected saleReportService: SaleReportService,
              protected reportDashBoardService: DashboardReportService,
              private router: Router) {}
  
  getListMeasure() {
    return ReportDashboardHelper.getListMeasureProductSold();
  }
  
  sortAmount(measure) {
    if (measure === 'revenue') {
      this.sort_measure             = measure;
      this.sort_desc                = !this.sort_desc;
      this.viewData['product_sold'] = _.reverse(this.viewData['product_sold']);
      this.changeDetector.detectChanges();
    }
  }
  
  getDataProductSold() {
    return this.viewData['product_sold'];
  }
  
  goToSaleReport() {
    this.saleReportService.viewDataFilter['report_type'] = 'product';
    this.saleReportService.viewDataFilter['dateTimeState'] = 'compare';
    this.saleReportService.viewDataFilter['compare_value'] = this.getCompareValueSaleReport();
    this.saleReportService.viewDataFilter['compare_type'] = 'last_from';
    this.saleReportService.viewDataFilter['compare_count'] = 1;
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
