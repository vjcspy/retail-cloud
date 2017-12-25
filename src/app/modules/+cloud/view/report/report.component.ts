import {Component, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import * as _ from "lodash";
import {AbstractRxComponent} from "../../../share/core/AbstractRxComponent";
import {SaleReportService} from "../../R/report/service";
import {ReportHelper} from "../../R/report/helper";
import {Observable} from "rxjs/Observable";
import {fakeAsync} from "@angular/core/testing";
@Component({
             selector: 'sale-report',
             templateUrl: 'report.component.html',
             styleUrls: [
               './report.component.scss'
             ],
           })
export class CloudSaleReportPage extends AbstractRxComponent implements OnInit {
  selectedAll: any;
  measures: any;
  searchString: any;
  
  constructor(protected saleReportService: SaleReportService ,protected changeDetector: ChangeDetectorRef ,
              protected reportHelper: ReportHelper) {
    super();
    this.initMeasures();
  }
  
  protected initMeasures(search: boolean = false) {
    if (!this.measures || !!search) {
      this.measures = this.getListMeasureByReportType(this.getDataFilter()['report_type'])['data'].map(function (measure) {
        return {
          measure_data: measure,
          position: measure['id'],
          selected: false
        };
      });
      _.forEach(this.measures, (measure) => {
        if (_.indexOf(this.getDataFilter()['measures'], measure.measure_data['label']) !== -1) {
          return measure.selected = true;
        }
      });
      _.remove(this.measures, function (measure_label) {
        return measure_label['measure_data']['label'] === 'base_row_total_product';
      });
    }
  }
  
  ngOnInit() {
    this._subscription['change_base_url']  =  this.saleReportService.getChangeBaseUrlStream().subscribe(() => {
      this.saleReportService.resolveDefaultData();
      this.saleReportService.getSaleReport();
    });
  
    this._subscription['update_view']  =  this.saleReportService.updateView().subscribe(() => {
      if (_.isEmpty(this.searchString)) {
        this.initMeasures(true);
      } else {
        this.searchMeasure(this.searchString);
      }
      this.changeDetector.detectChanges();
    });
  }
  
  trackByValue(index, measure) {
    return measure;
  }
  
  selectAll() {
    this.saleReportService.viewDataFilter['measures'] = [];
    for (let i = 0; i < this.measures.length; i++) {
      this.measures[i].selected = this.selectedAll;
      if (this.selectedAll === true) {
        this.saleReportService.viewDataFilter['measures'].push(this.measures[i].measure_data['label']);
      } else {
        this.saleReportService.viewDataFilter['measures'] = [];
      }
    }
    this.saleReportService.measure_selected[this.saleReportService.viewDataFilter['report_type']] = this.saleReportService.viewDataFilter['measures'];
  }
  checkIfAllSelected(measure) {
    this.searchMeasure(this.searchString);
  
    _.forEach(this.measures, function (mea) {
      if (mea['measure_data']['label'] === measure['measure_data']['label']){
        mea.selected = true;
      }
    });
    this.selectedAll = this.measures.every(function(item:any) {
      return item.selected === true;
    });
  
    if (measure.selected === true) {
      this.saleReportService.viewDataFilter['measures'].splice(measure.position-1, 0,  measure.measure_data['label']);
    } else {
      _.remove(this.saleReportService.viewDataFilter['measures'], function(measure_label) {
        return measure_label === measure.measure_data['label'];
      });
    }
    this.saleReportService.measure_selected[this.saleReportService.viewDataFilter['report_type']] = this.saleReportService.viewDataFilter['measures'];
    
    this.saleReportService.updateView().next();
  }
  
  changeMeasure(): void {
    this.saleReportService.measure_selected[this.saleReportService.viewDataFilter['report_type']] = this.saleReportService.viewDataFilter['measures'];
  }
  
  searchMeasure(searchString) {
    this.initMeasures(true);
    let measuresSearch = this.measures.filter((measure) => {
      if (!!searchString) {
        //noinspection TypeScriptUnresolvedFunction
        searchString = _.split(searchString, " ");
      
        let reString = "";
        _.forEach(searchString, (v) => {
          if (!_.isString(v)) {
            return true;
          }
          v = _.toLower(v);
          // escape regular expression special characters
          v = v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
          reString += ".*(" + v + "){1}";
        });
        reString += ".*";
        let re = new RegExp(reString, "gi");
        
        if (!re.test(_.toLower(measure.measure_data['label']))) {
          return false;
        }
      }
      return true;
    });
    this.measures = measuresSearch;
    this.selectedAll = this.measures.every(function(item:any) {
      return item.selected === true;
    });
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
    if (this.saleReportService.viewDataFilter['report_type'] == 'sales_summary' && measures.length <= 2 || measures.length === 0){
      if ((_.head(measures) == 'First Sale' && _.last(measures) == 'Last Sale') ||
          (_.head(measures) == 'First Sale' && measures.length == 1) ||
          (_.head(measures) == 'Last Sale' && measures.length == 1)
      ){
        this.saleReportService.enableFilter = false;
        return true;
      } else if (measures.length === 0) {
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
