import {Component, OnInit} from '@angular/core';
import * as _ from "lodash";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";
import {SaleReportService} from "../../R/report/service";
@Component({
             selector: 'sale-report',
             templateUrl: 'report.component.html',
             styleUrls: [
               './report.component.scss'
             ],
           })
export class CloudSaleReportPage extends AbstractRxComponent implements OnInit {
  
  constructor(protected saleReportService: SaleReportService) {
    super();
  }
  
  ngOnInit() {
    this._subscription['change_base_url']  =  this.saleReportService.getSearchCustomerStream().subscribe(() => {
      // this.saleReportService.resolveDefaultData();
      // this.saleReportService.getSaleReport();
    });
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
    _.forEach(this.saleReportService.getListMeasureByReportType()['data'], (measure) => {
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
}
