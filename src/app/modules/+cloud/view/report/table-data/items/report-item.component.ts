import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SaleReportService} from "../../../../R/report/service";
import {ReportHelper} from "../../../../R/report/helper";
import * as _ from "lodash";
import {AbstractRxComponent} from "../../../../../share/core/AbstractRxComponent";

@Component({
             selector: '[sale-report-item]',
             templateUrl: 'report-item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportItemComponent extends AbstractRxComponent implements OnInit {
  @Input('list_date') list_date       = [];
  @Input('data_filter') data_filter = [];
  @Input('measures') measures = [];
  @Input('item') item                 = [];
  @Input('is_date_ranger') is_date_ranger ;
  @Input('additionData') additionData = [];
  @Input('typeDisplay') typeDisplay ;
  @Input('colspanTotal') colspanTotal ;
  @Input('is_item_has_detail_data') canViewDetail: boolean;
  @Input('detail_item_value') detail_item_value: boolean;
  
  constructor(protected service: SaleReportService, protected route: ActivatedRoute, protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this._subscription['update_view']  =  this.service.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
  
  getFullnameUserReport(userId) {
    //     let userReport     = _.find(this.route.snapshot.data['users'], (row) => row['_id'] == userId);
    //     if (userReport)
    //         if (userReport['profile']['first_name'] || userReport['profile']['first_name'])
    //           return (userReport['profile']['first_name'] + userReport['profile']['last_name']);
    //         else
    //           return userReport['username'];
    //     else
    return userId;
  }
  
  protected isDateRanger() {
    if (this.data_filter['dateTimeState'] == "compare" ) {
      return false;
    }
    return true;
  }
  
  protected selectMoreInfo(is_total: boolean = false) {
    if (this.item.hasOwnProperty('item_details') && this.item['item_details'].length != 0 ) {
      this.item['display_item_detail'] = !this.item['display_item_detail'];
      this.service.resolveItemDisplay();
    } else {
      if (is_total) {
        // for sales summary
        this.service.getMoreItemData('Totals');
      } else {
        this.service.getMoreItemData(this.item['value']);
      }
      this.item['display_item_detail'] = true;
    }
  }
  
  protected getColspanForItem(value) {
    return (value == 'name') ? 3 : 1;
  }
  
  isDisplayItemDetail(addition) {
    if (addition == 'name'){
      return true;
    }
    return false;
  }
  
  customizeChevron() {
    if (this.item['display_item_detail'] == true) {
      return false;
    }
    return true;
  }
  
  getLabelForTitle(){
    let report_type = this.service.viewDataFilter['report_type'];
    let reportColumn     = _.find(ReportHelper.getListReportType()['data'], (row) => row['value'] == report_type);
    return reportColumn['label'];
  }
  
  getLabelForAdditionalData(additionalData) {
    let list_additional_data = [];
    let report_type = this.data_filter['report_type'];
    let additionalColumn = _.find(ReportHelper.getAdditionalData(report_type)['data'], (row) => row['value'] == additionalData);
    return additionalColumn['label'];
  }
  
  checkIsNumberDecimals(value){
    if (value == null || value == 'N/A' || isNaN(value)|| typeof value == 'undefined' || value == '--' || typeof value == 'string')
      return false;
    else
      return true;
  }
  
  checkNullValue(value) {
    if (value == null || value == 'N/A' || value == "NaN" || typeof value === 'undefined' || value == NaN)
      return true;
  }
  
  checkShowSymbolCurrency(measureLabel, value){
    if ((measureLabel == "Margin" || measureLabel == "Cart Size" || measureLabel == "Cart Value" ||
        measureLabel == "Cart Value (incl tax)" || measureLabel == "Discount percent" || measureLabel == "Return percent"|| measureLabel == "Customer Count" ||
        measureLabel == "First Sale" || measureLabel == "Item Sold" || measureLabel == "Last Sale"|| measureLabel == "Order Count" ||
        measureLabel == "Return count" || measureLabel == "Item Sold" || measureLabel == "Last Sale"|| measureLabel == "Order Count") ||
        this.checkIsNumberDecimals(value) == false) {
      return false;
    } else
      return true;
  }
}
