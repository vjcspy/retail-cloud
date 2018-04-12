import {Component, OnInit, Input, OnChanges} from '@angular/core';
import * as _ from "lodash";
import {SaleReportService} from "../../../R/report/service";
import {ReportHelper} from "../../../R/report/helper";
@Component({
             selector: 'sale-report-table',
             templateUrl: 'report-table.component.html',
             // changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportTableComponent implements OnInit, OnChanges {
  @Input('data_view') data_view     = [];
  @Input('data_filter') data_filter = [];
  @Input('detail_item') detail_item = [];
  @Input('detail_item_value') detail_item_value = [];
  @Input('measure') list_measure =[];
  @Input('base_currency_code') base_currency_code;
  
  protected _additionData = {
    isAllChecked: false,
  };
  
  protected viewData = {
    additionData :[],
  };
  
  constructor(private saleReportService: SaleReportService) {
    this.initDefaultViewData();
    this.initSelectDefault();
  }
  ngOnInit() {
    // phải subscripe vào đây  hoặc changeDetection không được set onPush vì component này vẫn phải get data trực tiếp từ service .(filter)phải
    //  viết lại
    
    // this._subscription['update_view']  =  this.saleReportService.updateView().subscribe(() => {
    //   this.changeDetector.detectChanges();
    // });
  }
  
  protected initSelectDefault() {
    this._additionData = {
      isAllChecked: false,
    }
  }
  
  protected initDefaultViewData() {
    if (this.viewData.hasOwnProperty('additionData')) {
      let report_type = this.data_filter['report_type'];
      let addition = ReportHelper.getAdditionalData(report_type)['data'];
      _.remove(addition,  (data) => {
        return data['id'] !== 1;
      });
      this.viewData['additionData'] = addition;
    }
    this.saleReportService.viewData['columnForFilter'] = this.viewData['additionData'];
    return this.viewData['additionData'];
  }
  
  ngOnChanges() {
    if (this.saleReportService.changeReportType == true) {
      this.viewData['additionData'] = [{id: 1, label: "Name", value: "name"}];
      this.initSelectDefault();
    }
    this.saleReportService.viewData['columnForFilter'] = this.viewData['additionData'];
  }
  
  getLabelDateRange() {
        return this.saleReportService.viewDataFilter['compare_value'];
      }
  
  checkSummaryType() {
    return (this.data_filter['report_type'] === 'sales_summary') ? 1 : 0;
  }
  
  protected trackOption(option: Object) {
    return option['name'];
  }
  
  protected checkShowAdditionPopup(addition) {
    let lastRow = _.last(this.viewData['additionData']);
    if ((this.data_filter['report_type'] === 'customer' || this.data_filter['report_type'] === 'product') && addition === lastRow['value'])
      return false;
    else return true;
  }
  
  protected getColspanForHeader() {
    return _.size(this.viewData['additionData']) + 2;
  }
  
  protected getColspanForTitle(value) {
    return (value === 'name') ? 3 : 1;
  }
  
  protected getAdditionalDataForPopUp() {
    let report_type = this.data_filter['report_type'];
    let additionalDataForPopUp = ReportHelper.getAdditionalData(report_type)['data'];
    _.remove(additionalDataForPopUp, (data) => {
      return data['id'] === 1;
    });
    return {
      data: additionalDataForPopUp,
    }
  }
  
  trackByValue(index, measure) {
    return measure['value'];
  }
  
  protected selectAllAdditionData() {
    let report_type = this.data_filter['report_type'];
    let additionData = this.getAdditionByReportType();
    if (this._additionData['isAllChecked'] == false) {
      _.forEach(additionData, (value, key) => {
        additionData[key] = true;
      });
    }
    this._additionData = additionData;
    return additionData;
  }
  
  protected selectAddtion() {
    this._additionData['isAllChecked'] = false;
  }
  
  protected getAdditionByReportType() {
    let report_type = this.data_filter['report_type'];
    if (report_type === 'customer') {
      let additionData = {
        customer_email: false,
        customer_group_code: false,
        customer_telephone: false,
      }
      Object.assign(this._additionData, additionData);
    }
    if (report_type === 'product') {
      let additionData = {
        sku: false,
        product_type: false,
        manufacturer: false,
      };
      Object.assign(this._additionData, additionData);
    }
    return this._additionData;
  }
  
  protected applyAdditionField() {
    let report_type = this.data_filter['report_type'];
    let dataForPopupDisplayAddition = this.getAdditionalDataForPopUp()['data'];
    let dataForPopupDisplayAdditionSelected = this.initDefaultViewData();
    if (this._additionData['isAllChecked'] == true) {
      this.viewData['additionData'] = ReportHelper.getAdditionalData(report_type)['data'];
    } else {
      _.forEach(this._additionData, (value, key) => {
        if (value == true) {
          let addition = _.find(dataForPopupDisplayAddition, (row) => row['value'] == key);
          dataForPopupDisplayAdditionSelected.push(addition);
        }
      });
      this.viewData['additionData']= dataForPopupDisplayAdditionSelected;
    }
    this.saleReportService.viewData['columnForFilter'] = this.viewData['additionData'];
    this.saleReportService.changeReportType = false;
    return this.viewData['additionData'];
  }
  
  protected getListDateFilter() {
    return this.data_view['list_date_filter'];
  }
  
  protected getListMeasure() {
    return this.data_filter['measures'];
  }
  
  protected isDateRanger() {
    if (this.data_filter['dateTimeState'] === "compare" ) {
      return false;
    }
    return true;
  }
  
  protected isdisplayMoreData(item) {
    if (this.data_filter['report_type'] === "register" ||
        this.data_filter['report_type'] === "customer" ||
        this.data_filter['report_type'] === "sales_summary"
    ) {
      return false;
    }
    return true;
  }
  
  protected hiddenItemDetail(item) {
    if (item.hasOwnProperty('display_item_detail') && item['display_item_detail'] == true) {
      return false;
    }
    return true;
  }
  
  refactorAdditionData() {
    let additionalData = [];
    _.forEach(this.list_measure, (measure) => {
      let additionalItem = _.find(this.data_view['totalInVertical'], (item)=>item['name'] == measure);
      if (additionalItem) {
        additionalData.push(additionalItem);
      }
    });
    return additionalData;
  }
  
  checkDisplayProductForSalesSummary() {
    if (this.checkSummaryType() === 1 && this.data_view['totalInHontical']['display_item_detail'] === true) {
      return false;
    }
    return true;
  }
  
  checkDataNullForHidden() {
    if (this.saleReportService.viewData['report_type'] === 'sales_summary') {
      return false;
    } else {
      if (this.saleReportService.viewData['items'].length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }
  
  checkSortAsc(measureLabel) {
    if (measureLabel) {
      if (measureLabel === this.saleReportService._sortData) {
        if (this.saleReportService.isSortAsc) {
          return 2;
        } else {
          return 3;
        }
      } else {
        return 1;
      }
    }
  }
  
  getLabelForTitle() {
    let report_type = this.saleReportService.viewDataFilter['report_type'];
    let reportColumn     = _.find(ReportHelper.getListReportType()['data'], (row) => row['value'] === report_type);
    return reportColumn['label'];
  }
}
