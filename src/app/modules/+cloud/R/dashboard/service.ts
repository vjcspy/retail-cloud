import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import * as $q from "q";
import * as _ from "lodash";
import * as moment from "moment";
import {ApiManager} from "../../../../services/api-manager";
import {RequestService} from "../../../../services/request";
import {NotifyManager} from "../../../../services/notify-manager";
import {LocalStorage} from "ngx-webstorage";
import {OnlineOfflineModeService} from "../../../../services/online-offline-mode.service";

@Injectable()
export class DashboardReportService {
  //
  // @LocalStorage('baseUrl')
  // public baseUrl: string;
  //
  // protected stream               = {
  //   refreshSaleReport: new Subject(),
  //   change_page : new Subject(),
  //   over_loadding : new Subject()
  // };
  //
  // public measure_selected = {};
  // public viewDataFilter   = {};
  // public viewData         = {};
  //
  // public viewState = {
  //   isOverLoad: true,
  //   isOverLoadReport : false
  // };
  //
  // public _sortData: string;
  // public _filterData = {};
  // public isSortAsc: boolean;
  // public changeReportType: boolean = false;
  // public enableFilter: boolean = false;
  //
  // constructor(protected toast: NotifyManager,
  //             protected requestService: RequestService,
  //             protected apiUrlManager: ApiManager,
  //             protected reportHelper: ReportHelper,
  //             protected router: Router){
  //   this.resolveDefaultData();
  // }
  //
  // private initDefaultValueFilter() {
  //   this._filterData = {};
  // }
  //
  // resolveDefaultData() {
  //   this._filterData    = {};
  //   this.viewData       = {};
  //
  //   this.viewState        = {
  //     isOverLoad: true,
  //     isOverLoadReport : false
  //   };
  //   this.initDefaultValue();
  // }
  //
  // private initDefaultValue() {
  //   this.viewDataFilter = {
  //     scope: this.getScopeData(),
  //     period: 7d,
  //     dateStart: moment().subtract(7, 'day').format("YYYY-MM-DD 00:00:00"),
  //     dateEnd: moment().format("YYYY-MM-DD 23:59:59")
  //   };
  //   this.viewData       = {
  //     list_date_filter: [],
  //     items: []
  //   };
  // }
  //
  //
  // initRequestReportData() {
  //   return {
  //     'scope': this.getScopeData(),
  //     'period': this.viewDataFilter['period'],
  //     // 'dateStart': moment(this.viewDataFilter['dateStart']).format() + '/' + this.viewDataFilter['dateStart'] ,
  //     // 'dateEnd': moment(this.viewDataFilter['dateEnd']).format() + '/' + this.viewDataFilter['dateEnd']
  //     'dateStart': this.viewDataFilter['dateStart'] ,
  //     'dateEnd':this.viewDataFilter['dateEnd']
  //   };
  // }
  //
  // convertData(itemsData, group_data_report_type, base_currency) {
  //   this.viewData = {
  //     list_date_filter: [],
  //     items: [],
  //   };
  //   _.forEach(itemsData, (item) => {
  //
  //     // start get date time ranger
  //     let dateRangerConvert = ReportHelper.convertDate(item['data'], this.viewDataFilter['compare_value']);
  //     this.viewData['list_date_filter'].push(dateRangerConvert);
  //     item['dateRanger'] = dateRangerConvert;
  //   });
  //   // start get data group by report type value
  //   _.forEach(group_data_report_type, (report_type_data) => {
  //     let report_type     = [];
  //     report_type['item_details'] = [];
  //     report_type['display_item_detail'] = false;
  //     report_type['name'] = _.isObject(report_type_data['value']) ? report_type_data['value']['name'] : (report_type_data['value'] == 'N/A' ? (this.viewDataFilter['report_type'] != 'sales_summary' ? ('No ' + this.getLabelForTitle()) : 'Totals') : report_type_data['value']);
  //
  //     // add them value de filter doi voi nhung data can hien thi them data
  //     if (this.viewDataFilter['report_type'] == "payment_method" ||
  //         this.viewDataFilter['report_type'] == "order_status" ||
  //         this.viewDataFilter['report_type'] == "register" ||
  //         this.viewDataFilter['report_type'] == "customer" ||
  //         this.viewDataFilter['report_type'] == "region"||
  //         this.viewDataFilter['report_type'] == "outlet" ||
  //         this.viewDataFilter['report_type'] == "category") {
  //       report_type['value'] = report_type_data['data'];
  //     }
  //
  //     if (this.viewDataFilter['report_type'] == 'customer') {
  //       report_type['customer_email']      = report_type_data['value']['email'];
  //       report_type['customer_telephone']  = report_type_data['value']['phone'];
  //       report_type['customer_group_code'] = report_type_data['value']['customer_group_code'];
  //       report_type['total_shipping_amount']  = report_type_data['value']['total_shipping_amount'];
  //     }
  //
  //     if (this.viewDataFilter['report_type'] == 'reference_number') {
  //       report_type['outlet']      = report_type_data['value']['outlet'];
  //     }
  //
  //     if (this.viewDataFilter['report_type'] == 'register' || this.viewDataFilter['report_type'] == 'sales_summary') {
  //       report_type['total_shipping_amount']  = report_type_data['total_shipping_amount'];
  //     }
  //
  //     if (this.viewDataFilter['report_type'] == 'product') {
  //       report_type['sku']          = report_type_data['value']['sku'];
  //       report_type['product_type'] = report_type_data['value']['product_type'];
  //       report_type['manufacturer'] = report_type_data['value']['manufacturer'];
  //     }
  //     _.forEach(itemsData, (item) => {
  //       let model = _.find(item['value'], function (option) {
  //         if (_.isObject(option) && option.hasOwnProperty('data_report_type') &&
  //             option['data_report_type'] == report_type_data['data'])
  //           return option;
  //       });
  //       if (model) {
  //         if (this.viewDataFilter['report_type'] == 'payment_method' || this.viewDataFilter['report_type'] == 'shipping_method') {
  //           report_type[item['dateRanger']] = parseFloat(model['grand_total']);
  //         } else {
  //           report_type[item['dateRanger']] = parseFloat(model['revenue']);
  //         }
  //         _.forEach(this.reportHelper.getListMeasureByReportType(this.viewDataFilter['report_type'])['data'], (measure) => {
  //           if (this.checkCalculateMeasureData(measure['label'])) {
  //             if (measure['label'] == "First Sale") {
  //               if (model[measure['value']]) {
  //                 if (!report_type.hasOwnProperty(measure['label']) || model[measure['value']] < report_type[measure['label']]) {
  //                   report_type[measure['label']] = model[measure['value']];
  //                 }
  //               }
  //             }else if( measure['label'] == "Last Sale"){
  //               if (model[measure['value']]) {
  //                 if (!report_type.hasOwnProperty(measure['label']) || model[measure['value']] > report_type[measure['label']]) {
  //                   report_type[measure['label']] = model[measure['value']];
  //                 }
  //               }
  //             } else {
  //               if (!report_type.hasOwnProperty(measure['label'])) {
  //                 report_type[measure['label']] = parseFloat(model[measure['value']]);
  //               } else {
  //                 report_type[measure['label']] += parseFloat(model[measure['value']]);
  //               }
  //             }
  //           }
  //         });
  //
  //       } else {
  //         report_type[item['dateRanger']] = "--"
  //       }
  //     });
  //     // Object.assign()
  //     this.viewData['items'].push(report_type);
  //   });
  //
  //   // convert data
  //   _.forEach(this.viewData['items'], (item)=> {
  //     this.calculateItemData(item);
  //   });
  //
  //   // auto view payment_method retail detail
  //   if (this.viewDataFilter['report_type'] == "payment_method") {
  //     _.forEach(this.viewData['items'], (itemDetail)=> {
  //       if (itemDetail['value'] == "retailmultiple") {
  //         this.getMoreItemData('retailmultiple');
  //       }
  //     });
  //   }
  //
  //   // auto view order_status magento  detail
  //   if (this.viewDataFilter['report_type'] == "order_status") {
  //     _.forEach(this.viewData['items'], (itemDetail) => {
  //       if (itemDetail['value'] == "magento_status") {
  //         this.getMoreItemData('magento_status');
  //       }
  //     });
  //   }
  //
  //   this.viewData['symbol_currency'] = base_currency;
  //
  //   // start get data total
  //   this.getTotalInHonticalByMeasure();
  //
  //   // start get data by date ranger
  //   if (this.viewDataFilter['dateTimeState'] == "compare") {
  //     this.getTotalInVertical(itemsData);
  //   }
  //   this.calculateItemData(this.viewData['totalInHontical']);
  //
  //   this.resolveItemDisplay(this._sortData);
  // }
  //
  // getSaleReport(force: boolean = false, resetFilet: boolean = false, changeReportType = false) {
  //   if (changeReportType) {
  //     this.initSortDefaultValue();
  //     if (!this.measure_selected.hasOwnProperty(this.viewDataFilter['report_type'])){
  //       this.getMeasureSelectedColumn(true);
  //     }else{
  //       this.viewDataFilter['measures'] =   this.measure_selected[this.viewDataFilter['report_type']];
  //     }
  //   }
  //   if (!force)
  //     this.initDefaultValueFilter();
  //   let data = this.initRequestReportData();
  //   this.postSaleReport(data);
  //   if (!resetFilet)
  //     this.enableFilter = false;
  //   if (changeReportType == true)
  //     this.changeReportType = true;
  // }
  //
  // private postSaleReport(report) {
  //   let defer = $q.defer();
  //   this.viewState.isOverLoad = false ;
  //   this.viewState.isOverLoadReport = true ;
  //   // if (!this.onlineOfflineService.online) {
  //   //   this.viewState.isOverLoad = true ;
  //   //   return defer.resolve(true);
  //   // } else {
  //   let _query = this.apiUrlManager.get('salesreport', this.baseUrl);
  //   this.requestService.makePost(_query, report)
  //       .subscribe(
  //         (data) => {
  //           if (_.isObject(data)) {
  //             this.convertData(data['items'], data['group_data'], data['base_currency']);
  //             if (data['date_ranger']){
  //               this.viewDataFilter['current_dateStart'] = data['date_ranger']['date_start'];
  //               this.viewDataFilter['current_dateEnd'] = data['date_ranger']['date_end'];
  //             }
  //             this.viewState.isOverLoad = true ;
  //             this.viewState.isOverLoadReport = false ;
  //             this.updateOverLoadSteam().next();
  //             return defer.resolve(true);
  //           } else {
  //             this.viewState.isOverLoad = true ;
  //             this.viewState.isOverLoadReport = false ;
  //             this.updateOverLoadSteam().next();
  //             this.toast.error("Some problem occur when load data sales report");
  //           }
  //           // this.viewState.isOverLoad = true ;
  //           // this.viewState.isOverLoadReport = false ;
  //         },
  //         (e) => {
  //           this.toast.error("Some problem occur when load data sales report");
  //           this.viewState.isOverLoad = false ;
  //           this.viewState.isOverLoadReport = false ;
  //           this.updateOverLoadSteam().next();
  //           return defer.resolve(false);
  //         }
  //       );
  //   return defer.promise;
  //   // }
  // }
  //
  // protected getLabelForTitle(){
  //   let report_type = this.viewDataFilter['report_type'];
  //   let reportColumn     = _.find(ReportHelper.getListReportType()['data'], (row) => row['value'] == report_type);
  //   return reportColumn['label'];
  // }
  //
  //
  // getReportTypeData() {
  //   if (!this.viewDataFilter.hasOwnProperty("report_type")) {
  //     return this.viewDataFilter['report_type'] = ReportHelper.getListReportType()['data'][0]['value'];
  //   }
  //   return this.viewDataFilter['report_type'];
  // }
  //
  // getMeasureSelectedColumn(fource: boolean = false) {
  //   if (!this.viewDataFilter.hasOwnProperty('measures') || fource) {
  //     let report_type = this.viewDataFilter['report_type'];
  //     this.viewDataFilter['measures'] = [];
  //     _.forEach(this.reportHelper.getListMeasureByReportType(report_type, true)['data'], (measure)=> {
  //       this.viewDataFilter['measures'].push(measure['label']);
  //     });
  //   }
  //   this.measure_selected[this.viewDataFilter['report_type']] =   this.viewDataFilter['measures'];
  //   return this.viewDataFilter['measures'];
  // }
  //
  // removeSelectedMeasure(measureSelected) {
  //   if (this.viewDataFilter.hasOwnProperty('measures')) {
  //     _.remove(this.viewDataFilter['measures'], function (measures) {
  //       return measures == measureSelected
  //     });
  //   }
  //   this.measure_selected[this.viewDataFilter['report_type']] = this.viewDataFilter['measures'];
  // }
  //
  // protected initDataFilterReport(dataFilter) {
  //   let report_type = this.viewDataFilter['report_type'];
  //   let measure     = this.reportHelper.getListMeasureByReportType(report_type)['data'];
  //   let filterData  = [];
  //   _.forEach(dataFilter, function (value, key) {
  //     if (typeof value != 'undefined' && key == 'name') {
  //       filterData.push({
  //                         "name": report_type,
  //                         "search_value": value
  //                       });
  //     } else {
  //       if (typeof value != 'undefined') {
  //         let valueMeasure = _.find(measure, (row) => row['label'] == key);
  //         if (valueMeasure) {
  //           filterData.push({
  //                             "name": valueMeasure['value'],
  //                             "search_value": value
  //                           });
  //         } else
  //           filterData.push({
  //                             "name": key,
  //                             "search_value": value
  //                           });
  //       }
  //     }
  //   });
  //   return filterData;
  // }
  //
  // resolveItemDisplay(measureLabel: string = null,isFilter = false) {
  //   if (isFilter) {
  //     if (measureLabel == this._sortData) {
  //       this.isSortAsc = !this.isSortAsc;
  //     } else {
  //       this.isSortAsc = true;
  //     }
  //   }
  //     if(measureLabel != null){
  //     this._sortData = measureLabel;
  //     }
  //   let listDataSoft = _.filter(this.viewData['items'], function (item) {
  //     return item['display_item_detail'] != true ;
  //   });
  //   this.viewData['items'] =  _.filter(this.viewData['items'], function (item) {
  //     return item['display_item_detail'] == true ;
  //   });
  //     // mac dinh sort desc
  //   listDataSoft = _.sortBy(listDataSoft, [(item) => {
  //       if (this._sortData == 'First Sale' || this._sortData == 'Last Sale') {
  //         return _.toLower(item[this._sortData]);
  //       } else {
  //         return parseFloat(item[this._sortData]);
  //       }
  //     }]);
  //     if (this.isSortAsc) {
  //       //noinspection TypeScriptUnresolvedFunction
  //       listDataSoft = _.reverse(listDataSoft);
  //     }
  //   this.viewData['items'] = _.concat(this.viewData['items'], listDataSoft);
  //   this.viewState.isOverLoad = true;
  //   this.updateView().next();
  // }
  //
  // getChangeBaseUrlStream() {
  //   if (!this.stream.hasOwnProperty('change_page')) {
  //     this.stream.change_page = new Subject();
  //     this.stream.change_page = <any>this.stream.change_page.share();
  //   }
  //   return this.stream.change_page;
  // }
  //
  // updateView(){
  //   if(!this.stream.hasOwnProperty('refreshSaleReport')){
  //   this.stream.refreshSaleReport = new Subject();
  //   this.stream.refreshSaleReport = <any>this.stream.refreshSaleReport.share();
  //   }
  //   return this.stream.refreshSaleReport;
  // }
  //
  // updateOverLoadSteam(){
  //   if (!this.stream.hasOwnProperty('over_loadding')) {
  //     this.stream.over_loadding = new Subject();
  //     this.stream.over_loadding = <any>this.stream.over_loadding.share();
  //   }
  //   return this.stream.over_loadding;
  // }
}

