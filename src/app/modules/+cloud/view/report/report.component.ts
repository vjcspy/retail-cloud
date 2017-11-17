import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import * as _ from "lodash";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";
import {SaleReportService} from "../../R/report/service";
import {ReportHelper} from "../../R/report/helper";
import {Observable} from "rxjs/Observable";
@Component({
             selector: 'sale-report',
             templateUrl: 'report.component.html',
             styleUrls: [
               './report.component.scss'
             ],
           })
export class CloudSaleReportPage extends AbstractRxComponent implements OnInit {
  constructor(protected saleReportService: SaleReportService ,protected changeDetector: ChangeDetectorRef ,
              protected reportHelper: ReportHelper) {
    super();
  }
  
  ngOnInit() {
    this._subscription['change_base_url']  =  this.saleReportService.getChangeBaseUrlStream().subscribe(() => {
      this.saleReportService.resolveDefaultData();
      this.saleReportService.getSaleReport();
    });
  
    this._subscription['update_view']  =  this.saleReportService.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
  
  changeMeasure(): void {
    this.saleReportService.measure_selected[this.saleReportService.viewDataFilter['report_type']] = this.saleReportService.viewDataFilter['measures'];
  }
  
  getListReportType(){
    return ReportHelper.getListReportType();
  }
  
  getListExtraInfo(){
    return ReportHelper.getListExtraData();
  }
  
  getListMeasureByReportType(report_type){
    return this.reportHelper.getListMeasureByReportType(report_type);
  }
  
  getDataFilter() {
    return this.saleReportService.viewDataFilter;
  }
  
  getDataView() {
    return this.saleReportService.viewData;
  }
  
  exportCSV() {
    let json2csv = require('json2csv');
    let fs       = require('file-saver');
    
    let field = Object.assign([], this.getDataView()['list_date_filter']);
    if (!field.hasOwnProperty('name')) {
      field.unshift("name");
    }
    _.forEach(this.getListMeasureByReportType(this.getDataFilter()['report_type'])['data'], (measure) => {
      if (measure['label'] != 'base_row_total_product')
        field.push(measure['label']);
    });
    
    let listItem = [];
    if (this.getDataFilter()['report_type'] == "payment_method") {
      _.forEach(this.getDataView()['items'], (itemData) => {
        listItem.push(itemData);
        if (itemData.hasOwnProperty('value') && itemData['value'] == "retailmultiple") {
          _.forEach(this.getDataView()['list_item_detail'], (itemDetail) => {
            if (itemDetail.hasOwnProperty('name')) {
              itemDetail['name'] = "ConnectPOS Payment Method _ " + itemDetail['name'];
            }
            listItem.push(itemDetail);
          });
        }
      });
    } else if (this.getDataFilter()['report_type'] == "order_status") {
      _.forEach(this.getDataView()['items'], (itemData) => {
        listItem.push(itemData);
        if (itemData.hasOwnProperty('value') && itemData['value'] == "magento_status") {
          _.forEach(this.getDataView()['list_item_detail'], (itemDetail) => {
            if (itemDetail.hasOwnProperty('name')) {
              itemDetail['name'] = "Magento Order Status _ " + itemDetail['name'];
            }
            listItem.push(itemDetail);
          });
        }
      });
    } else {
      _.forEach(this.getDataView()['items'], (itemData) => {
        if (itemData.hasOwnProperty('base_row_total_product')) {
          _.omit(itemData, ['base_row_total_product']);
        }
        listItem.push(itemData);
      });
      // listItem = Object.assign([], this.getDataView()['items']);
    }
    
    if (this.getDataFilter()['report_type'] != "sales_summary") {
      listItem.push(this.getDataView()['totalInHontical']);
    }
    
    _.forEach(this.getDataView()['additionalData'], (itemData) => {
      if (itemData.hasOwnProperty('name') && itemData['name'] != "base_row_total_product") {
        listItem.push(itemData);
      }
    });
    let csv = json2csv({data: listItem, fields: field, del: ','});
    fs.saveAs(new Blob([csv], {type: 'text/csv'}), this.getCSVFileName());
  }
  
  getCSVFileName() {
    let fileCSV;
    if (this.getDataFilter()['dateTimeState'] == "compare") {
      if (this.getDataFilter()['compare_type'] == "to_date"){
        fileCSV = "CReport_" + this.getDataFilter()['report_type'] + "_by_" + this.getDataFilter()['compare_value']  + "_to_"+this.getDataFilter()['current_dateEnd']+".csv";
      } else {
        fileCSV = "CReport_" + this.getDataFilter()['report_type'] + "_by_" + this.getDataFilter()['compare_value'] + ".csv";
      }
      
    } else {
      fileCSV = "CReport_" + this.getDataFilter()['report_type'] + "_from_" + this.getDataFilter()['current_dateStart']
                + "_to_" + this.getDataFilter()['current_dateEnd'] + ".csv" ;
    }
    return fileCSV;
  }
  
  checkDisableFilter() {
    let measures = this.saleReportService.viewDataFilter['measures'];
    if (this.saleReportService.viewDataFilter['report_type'] == 'sales_summary' && measures.length <= 2){
      if ((_.head(measures) == 'First Sale' && _.last(measures) == 'Last Sale') ||
          (_.head(measures) == 'First Sale' && measures.length == 1) ||
          (_.head(measures) == 'Last Sale' && measures.length == 1)
      ){
        this.saleReportService.enableFilter = false;
        return true;
      }
    } else
      return false;
  }
  
  enableFilterMeasure() {
    this.saleReportService.enableFilter = !this.saleReportService.enableFilter;
    return this.saleReportService.enableFilter;
  }
  
  checkDataNullForHidden() {
    if (this.saleReportService.viewData['report_type'] == 'sales_summary') {
      return false;
    } else {
      if (this.saleReportService.viewData['items'].length == 0) {
        return true;
      } else
        return false;
    }
  }
}
