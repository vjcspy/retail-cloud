import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import * as $q from "q";
import * as _ from "lodash";
import * as moment from "moment";
import {ApiManager} from "../../../../services/api-manager";
import {RequestService} from "../../../../services/request";
// import {OfflineService} from "../../../share/provider/offline";
import {NotifyManager} from "../../../../services/notify-manager";
import {ReportHelper} from "./helper";
import {LocalStorage} from "ngx-webstorage";
import {OnlineOfflineModeService} from "../../../../services/online-offline-mode.service";

@Injectable()
export class SaleReportService {
  
  @LocalStorage('baseUrl')
  public baseUrl: string;
  
  protected stream               = {
    refreshSaleReport: new Subject(),
    change_page : new Subject(),
    over_loadding : new Subject()
  };
  
  public measure_selected = {};
  public viewDataFilter   = {};
  public viewData         = {};
  
  public viewState = {
    isOverLoad: true,
    isOverLoadReport : false
  };
  
  public _sortData: string;
  public _filterData = {};
  public isSortAsc: boolean = false;
  public changeReportType: boolean = false;
  
  constructor(protected toast: NotifyManager,
              protected requestService: RequestService,
              protected onlineOfflineService:OnlineOfflineModeService,
              protected apiUrlManager: ApiManager,
              protected router: Router){
    this.resolveDefaultData();
  }
  
  private initDefaultValueFilter() {
    this._filterData = {};
  }
  
  resolveDefaultData() {
    this._filterData    = {};
    this.viewDataFilter = {};
    this.viewData       = {};
    
    this.viewState        = {
      isOverLoad: true,
      isOverLoadReport : false
    };
    this.measure_selected = [];
    this.initDefaultValue();
  }
  
  private initDefaultValue() {
    this.viewDataFilter = {
      report_type: this.getReportTypeData(),
      measures: this.getMeasureSelectedColumn(),
      openDateFilter: false,
      dateTimeState: "compare",
      // dateTimeState: "ranger",
      compare_value: "week",
      compare_type: "last",
      compare_count: 4,
      dateStart: moment().subtract(3, 'week').startOf('week').format("YYYY-MM-DD 00:00:00"),
      dateEnd: moment().endOf('week').format("YYYY-MM-DD 23:59:59"),
      
      current_dateStart: moment().subtract(3, 'week').startOf('week').format("YYYY-MM-DD 00:00:00"),
      current_dateEnd: moment().endOf('week').format("YYYY-MM-DD 23:59:59"),
      item_view_detail : null,
    };
    this.viewData       = {
      list_date_filter: [],
      items: [],
      totalInVertical: [],
      totalInHontical: [],
      columnForFilter: [],
      list_item_detail : []
    };
    
    this._sortData = "NONE";
    this.isSortAsc = false;
    this.measure_selected = [];
  }
  
  initSortDefaultValue(){
    this._sortData = "NONE";
    this.isSortAsc = false;
  }
  
  initRequestReportData(filter = null, item_filter = null) {
    let is_date_compare: boolean = true;
    if (this.viewDataFilter['dateTimeState'] == "ranger") {
      is_date_compare = false;
    }
    return {
      'type': this.getReportTypeData(),
      'item_filter': item_filter,
      'date_start': moment(this.viewDataFilter['dateStart']).format() + '/' + this.viewDataFilter['dateStart'] ,
      'date_end': moment(this.viewDataFilter['dateEnd']).format() + '/' + this.viewDataFilter['dateEnd'],
      'is_date_compare': is_date_compare,
      'period_data': {
        'range_type': this.viewDataFilter['compare_value'],
        'type': this.viewDataFilter['compare_type'],
        'count': this.viewDataFilter['compare_count']
      },
      'column': null,
      'filter': this.initDataFilterReport(this._filterData),
    };
  }
  
  convertData(itemsData, group_data_report_type, base_currency) {
    this.viewData = {
      list_date_filter: [],
      items: [],
      totalInVertical: [],
      totalInHontical: [],
      list_item_detail :[]
    };
    _.forEach(itemsData, (item) => {
      
      // start get date time ranger
      let dateRangerConvert = ReportHelper.convertDate(item['data'], this.viewDataFilter['compare_value']);
      this.viewData['list_date_filter'].push(dateRangerConvert);
      item['dateRanger'] = dateRangerConvert;
    });
    // start get data group by report type value
    _.forEach(group_data_report_type, (report_type_data) => {
      let report_type     = [];
      report_type['item_details'] = [];
      report_type['display_item_detail'] = false;
      report_type['name'] = _.isObject(report_type_data['value']) ? report_type_data['value']['name'] : (report_type_data['value'] == 'N/A' ? (this.viewDataFilter['report_type'] != 'sales_summary' ? ('No ' + this.getLabelForTitle()) : 'Totals') : report_type_data['value']);
      
      // add them value de filter doi voi nhung data can hien thi them data
      if (this.viewDataFilter['report_type'] == "payment_method" || this.viewDataFilter['report_type'] == "order_status" ||
          this.viewDataFilter['report_type'] == "register" || this.viewDataFilter['report_type'] == "customer" || this.viewDataFilter['report_type'] == "region") {
        report_type['value'] = report_type_data['data'];
      }
      
      if (this.viewDataFilter['report_type'] == 'customer') {
        report_type['customer_email']      = report_type_data['value']['email'];
        report_type['customer_telephone']  = report_type_data['value']['phone'];
        report_type['customer_group_code'] = report_type_data['value']['customer_group_code'];
        report_type['total_shipping_amount']  = report_type_data['value']['total_shipping_amount'];
      }
      
      if (this.viewDataFilter['report_type'] == 'register' || this.viewDataFilter['report_type'] == 'sales_summary') {
        report_type['total_shipping_amount']  = report_type_data['total_shipping_amount'];
      }
      
      if (this.viewDataFilter['report_type'] == 'product') {
        report_type['sku']          = report_type_data['value']['sku'];
        report_type['product_type'] = report_type_data['value']['product_type'];
        report_type['manufacturer'] = report_type_data['value']['manufacturer'];
      }
      _.forEach(itemsData, (item) => {
        let model = _.find(item['value'], function (option) {
          if (_.isObject(option) && option.hasOwnProperty('data_report_type') &&
              option['data_report_type'] == report_type_data['data'])
            return option;
        });
        if (model) {
          if (this.viewDataFilter['report_type'] == 'payment_method' || this.viewDataFilter['report_type'] == 'shipping_method') {
            report_type[item['dateRanger']] = parseFloat(model['grand_total']);
          } else {
            report_type[item['dateRanger']] = parseFloat(model['revenue']);
          }
          _.forEach(ReportHelper.getListMeasureByReportType(this.viewDataFilter['report_type'])['data'], (measure) => {
            if (this.checkCalculateMeasureData(measure['label'])) {
              if (measure['label'] == "First Sale") {
                if (model[measure['value']]) {
                  if (!report_type.hasOwnProperty(measure['label']) || model[measure['value']] < report_type[measure['label']]) {
                    report_type[measure['label']] = model[measure['value']];
                  }
                }
              }else if( measure['label'] == "Last Sale"){
                if (model[measure['value']]) {
                  if (!report_type.hasOwnProperty(measure['label']) || model[measure['value']] > report_type[measure['label']]) {
                    report_type[measure['label']] = model[measure['value']];
                  }
                }
              } else {
                if (!report_type.hasOwnProperty(measure['label'])) {
                  report_type[measure['label']] = parseFloat(model[measure['value']]);
                } else {
                  report_type[measure['label']] += parseFloat(model[measure['value']]);
                }
              }
            }
          });
          
        } else {
          report_type[item['dateRanger']] = "--"
        }
      });
      // Object.assign()
      this.viewData['items'].push(report_type);
    });
    
    // convert data
    _.forEach(this.viewData['items'], (item)=> {
      this.calculateItemData(item);
    });
    
    // auto view payment_method retail detail
    if (this.viewDataFilter['report_type'] == "payment_method") {
      _.forEach(this.viewData['items'], (itemDetail)=> {
        if (itemDetail['value'] == "retailmultiple") {
          this.getMoreItemData('retailmultiple');
        }
      });
    }
  
    // auto view order_status magento  detail
    if (this.viewDataFilter['report_type'] == "order_status") {
      _.forEach(this.viewData['items'], (itemDetail) => {
        if (itemDetail['value'] == "magento_status") {
          this.getMoreItemData('magento_status');
        }
      });
    }
    
    this.viewData['symbol_currency'] = base_currency;
    
    // start get data total
    this.getTotalInHonticalByMeasure();
    
    // start get data by date ranger
    if (this.viewDataFilter['dateTimeState'] == "compare") {
      this.getTotalInVertical(itemsData);
    }
    this.calculateItemData(this.viewData['totalInHontical']);
    
    this.resolveItemDisplay(this._sortData,true);
  }
  
  protected calculateItemData(item) {
    _.forEach(ReportHelper.getListMeasureByReportType(this.viewDataFilter['report_type'])['data'], (measure) => {
      item[measure['label']] = this.convertItemData(item, measure['label']);
    });
  }
  
  protected getLabelForTitle(){
    let report_type = this.viewDataFilter['report_type'];
    let reportColumn     = _.find(ReportHelper.getListReportType()['data'], (row) => row['value'] == report_type);
    return reportColumn['label'];
  }
  
  protected convertItemData(item, measureLabel) {
    let itemLable ;
    
    switch (measureLabel) {
      case "Margin" :
        itemLable = (item['Revenue'] == 0) ? "--" : (item['Gross Profit'] / item['Revenue']);
        break;
      case "Cart Size" :
        itemLable = item['Item Sold'] / item['Order Count'];
        break;
      case "Cart Value" :
        itemLable = item['Revenue'] / item['Order Count'];
        break;
      case "Cart Value (incl tax)" :
        itemLable = item['Total Sales'] / item['Order Count'];
        break;
      case "Discount percent":
        itemLable = item['Discount'] / (item['base_row_total_product'] + item['Discount']);
        break;
      case "Return percent" :
        itemLable = item['Return count'] / (item['Item Sold'] + item['Return count']);
        break;
      default :
        itemLable = item[measureLabel];
        break;
    }
    if (measureLabel == 'Last Sale' || measureLabel == 'First Sale')
      return itemLable;
    if (itemLable == null || itemLable == 'N/A' || itemLable == 'NaN' || isNaN(itemLable) || typeof itemLable == 'undefined' || itemLable == '--') {
      return 0;
    } else{
      return itemLable;
    }
    
  }
  
  getTotalInHonticalByMeasure() {
    this.viewData['totalInHontical']['name'] = "Totals";
    let totalInHontical                      = [];
    _.forEach(ReportHelper.getListMeasureByReportType(this.viewDataFilter['report_type'])['data'], (measure) => {
      _.forEach(this.viewData['items'], (items) => {
        if (this.checkCalculateMeasureData(measure['label'])) {
          if (measure['label'] == "First Sale" ) {
            if ((!totalInHontical.hasOwnProperty(measure['label'])) || (items[measure['label']] < totalInHontical[measure['label']])) {
              totalInHontical[measure['label']] = items[measure['label']];
            }
          }else if( measure['label'] == "Last Sale"){
            if ((!totalInHontical.hasOwnProperty(measure['label'])) || (items[measure['label']] > totalInHontical[measure['label']])) {
              totalInHontical[measure['label']] = items[measure['label']];
            }
          } else {
            // if (items[measure['label']])
            if (!totalInHontical.hasOwnProperty(measure['label'])) {
              totalInHontical[measure['label']] = parseFloat(items[measure['label']]);
            }else{
              totalInHontical[measure['label']] += parseFloat(items[measure['label']]);
            }
          }
        }
      });
      this.viewData['totalInHontical'][measure['label']] = totalInHontical[measure['label']];
    });
    if( this.viewDataFilter['report_type'] == 'sales_summary' ){
      this.viewData['totalInHontical']['total_shipping_amount'] = this.viewData['items'][0]['total_shipping_amount'];
    }
  }
  
  getTotalInVertical(itemsData) {
    _.forEach(ReportHelper.getListMeasureByReportType(this.viewDataFilter['report_type'])['data'], (additionalData)=> {
      let additionalItem     = [];
      additionalItem['name'] = additionalData['label'];
      _.forEach(itemsData, (item) => {
        additionalItem[item['dateRanger']] = 0;
        let totalRevenue                   = 0;
        let totalGrossProfit               = 0;
        let totalOrderCount                = 0;
        let totalItemSold                  = 0;
        let grandTotal                     = 0;
        let totalDiscountAmount            = 0;
        let totalReturnAmount              = 0;
        let totalInvoiced                  = 0;
        if ((additionalData['value'] == "revenue" && this.viewDataFilter['report_type'] != 'payment_method') ||
            (additionalData['value'] == "grand_total" && (this.viewDataFilter['report_type'] == "payment_method" ||this.viewDataFilter['report_type'] == "shipping_method") )) {
          this.viewData['totalInHontical'][item['dateRanger']] = 0;
        }
        _.forEach(item['value'], (itemValue)=> {
          // đối với sale summary lúc nào cũng trả về object kể cả khi không có order nào trong khoảng tgian ây
          if ((_.isObject(itemValue) && itemValue.hasOwnProperty('order_count') && itemValue['order_count'] != "0") ||
              ( this.viewDataFilter['report_type'] == "sales_summary" && itemValue['order_count']) != "0") {
            if (this.checkCalculateMeasureData(additionalData['label'])) {
              if (additionalData['value'] == "first_sale") {
                if (additionalItem[item['dateRanger']] == 0 || (itemValue['first_sale'] < additionalItem[item['dateRanger']])) {
                  if (additionalItem[item['dateRanger']] == 0 || (itemValue['first_sale'] < additionalItem[item['dateRanger']])) {
                    additionalItem[item['dateRanger']] = itemValue['first_sale'];
                  }
                }
              } else if (additionalData['value'] == "last_sale") {
                if (additionalItem[item['dateRanger']] == 0 || (itemValue['last_sale'] > additionalItem[item['dateRanger']])) {
                  additionalItem[item['dateRanger']] = itemValue['last_sale'];
                }
              } else {
                additionalItem[item['dateRanger']] += parseFloat(itemValue[additionalData['value']]);
              }
              if (additionalData['value'] == 'grand_total' &&
                  (this.viewDataFilter['report_type'] == "payment_method" || this.viewDataFilter['report_type'] == "shipping_method")) {
                this.viewData['totalInHontical'][item['dateRanger']] += parseFloat(itemValue[additionalData['value']]);
              }
              if (additionalData['value'] == "revenue" && this.viewDataFilter['report_type'] != 'payment_method') {
                this.viewData['totalInHontical'][item['dateRanger']] += parseFloat(itemValue[additionalData['value']]);
              }
            } else {
              if (additionalData['label'] == "Margin") {
                totalRevenue += parseFloat(itemValue['revenue']);
                totalGrossProfit += parseFloat(itemValue['gross_profit']);
                additionalItem[item['dateRanger']] = (totalRevenue == 0) ? "--" : (totalGrossProfit / totalRevenue);
              }
              if (additionalData['label'] == "Cart Value") {
                totalRevenue += parseFloat(itemValue['revenue']);
                totalOrderCount += parseFloat(itemValue['order_count']);
                additionalItem[item['dateRanger']] = (totalOrderCount == 0) ? "--" : (totalRevenue / totalOrderCount);
              }
              if (additionalData['label'] == "Cart Size") {
                totalItemSold += parseFloat(itemValue['item_sold']);
                totalOrderCount += parseFloat(itemValue['order_count']);
                additionalItem[item['dateRanger']] = (totalOrderCount == 0) ? "--" : (totalItemSold / totalOrderCount);
              }
              if (additionalData['value'] == "cart_value_incl_tax") {
                grandTotal += parseFloat(itemValue['grand_total']);
                totalOrderCount += parseFloat(itemValue['order_count']);
                additionalItem[item['dateRanger']] = (totalOrderCount == 0) ? "--" : (grandTotal / totalOrderCount);
              }
              if (additionalData['label'] == "Discount percent") {
                // itemLable = item['Discount'] / (item['base_row_total_product'] + item['Discount']);
                totalDiscountAmount += parseFloat(itemValue['discount_amount']);
                totalInvoiced += parseFloat(itemValue['base_row_total_product']);
                additionalItem[item['dateRanger']] = ((totalInvoiced + totalDiscountAmount) == 0) ? "--" : (totalDiscountAmount / (totalInvoiced + totalDiscountAmount));
              }
              if (additionalData['label'] == "Return percent") {
                totalReturnAmount += parseFloat(itemValue['return_count']);
                totalItemSold += parseFloat(itemValue['item_sold']);
                additionalItem[item['dateRanger']] = (totalItemSold == 0) ? "--" : (totalReturnAmount / totalItemSold);
              }
            }
          }
        });
      });
      this.viewData['totalInVertical'].push(additionalItem);
    });
  }
  
  checkCalculateMeasureData(measureLabel) {
    if (measureLabel == "Margin" || measureLabel == "Cart Size" || measureLabel == "Cart Value" ||
        measureLabel == "Cart Value (incl tax)" || measureLabel == "Discount percent" || measureLabel == "Return percent") {
      return false;
    }
    return true;
  }
  
  getSaleReport(force: boolean = false, resetFilet: boolean = false, changeReportType = false) {
    if (changeReportType) {
      this.initSortDefaultValue();
      if (!this.measure_selected.hasOwnProperty(this.viewDataFilter['report_type'])){
        this.getMeasureSelectedColumn(true);
      }else{
        this.viewDataFilter['measures'] =   this.measure_selected[this.viewDataFilter['report_type']];
      }
    }
    if (!force)
      this.initDefaultValueFilter();
    let data = this.initRequestReportData();
    this.postSaleReport(data);
    // if (!resetFilet)
    //   this.enableFilter = false;
    if (changeReportType == true)
      this.changeReportType = true;
  }
  
  private postSaleReport(report) {
    let defer = $q.defer();
    this.viewState.isOverLoad = false ;
    this.viewState.isOverLoadReport = true ;
    // if (!this.onlineOfflineService.online) {
    //   this.viewState.isOverLoad = true ;
    //   return defer.resolve(true);
    // } else {
      let _query = this.apiUrlManager.get('salesreport', this.baseUrl);
      this.requestService.makePost(_query, report)
          .subscribe(
            (data) => {
              if (_.isObject(data)) {
                this.convertData(data['items'], data['group_data'], data['base_currency']);
                if (data['date_ranger']){
                  this.viewDataFilter['current_dateStart'] = data['date_ranger']['date_start'];
                  this.viewDataFilter['current_dateEnd'] = data['date_ranger']['date_end'];
                }
                this.viewState.isOverLoad = true ;
                this.viewState.isOverLoadReport = false ;
                this.updateOverLoadSteam().next();
                return defer.resolve(true);
              } else {
                this.viewState.isOverLoad = true ;
                this.viewState.isOverLoadReport = false ;
                this.updateOverLoadSteam().next();
                this.toast.error("Some problem occur when load data sales report");
              }
              // this.viewState.isOverLoad = true ;
              // this.viewState.isOverLoadReport = false ;
            },
            (e) => {
              this.toast.error("Some problem occur when load data sales report");
              this.viewState.isOverLoad = false ;
              this.viewState.isOverLoadReport = false ;
              this.updateOverLoadSteam().next();
              return defer.resolve(false);
            }
          );
      return defer.promise;
    // }
  }
  
  getReportTypeData() {
    if (!this.viewDataFilter.hasOwnProperty("report_type")) {
      return this.viewDataFilter['report_type'] = ReportHelper.getListReportType()['data'][0]['value'];
    }
    return this.viewDataFilter['report_type'];
  }
  
  getMeasureSelectedColumn(fource:boolean = false) {
    if (!this.viewDataFilter.hasOwnProperty('measures') || fource) {
      let report_type = this.viewDataFilter['report_type'];
      this.viewDataFilter['measures'] = [];
      _.forEach(ReportHelper.getListMeasureByReportType(report_type, true)['data'], (measure)=> {
        this.viewDataFilter['measures'].push(measure['label']);
      });
    }
    this.measure_selected[this.viewDataFilter['report_type']] =   this.viewDataFilter['measures'];
    return this.viewDataFilter['measures'];
  }
  
  removeSelectedMeasure(measureSelected) {
    if (this.viewDataFilter.hasOwnProperty('measures')) {
      _.remove(this.viewDataFilter['measures'], function (measures) {
        return measures == measureSelected
      });
    }
    this.measure_selected[this.viewDataFilter['report_type']] = this.viewDataFilter['measures'];
  }
  
  protected initDataFilterReport(dataFilter) {
    let report_type = this.viewDataFilter['report_type'];
    let measure     = ReportHelper.getListMeasureByReportType(report_type)['data'];
    let filterData  = [];
    _.forEach(dataFilter, function (value, key) {
      if (typeof value != 'undefined' && key == 'name') {
        filterData.push({
                          "name": report_type,
                          "search_value": value
                        });
      } else {
        if (typeof value != 'undefined') {
          let valueMeasure = _.find(measure, (row) => row['label'] == key);
          if (valueMeasure) {
            filterData.push({
                              "name": valueMeasure['value'],
                              "search_value": value
                            });
          } else
            filterData.push({
                              "name": key,
                              "search_value": value
                            });
        }
      }
    });
    return filterData;
  }
  
  // làm riêng 1 function để lấy thêm data cho những item (retail multi trong payment method)
  getMoreItemData(item_filter) {
    this.viewDataFilter['item_view_detail'] = item_filter;
    this.postItemDetail(this.initRequestReportData(null, item_filter));
  }
  
  private postItemDetail(report) {
    let defer                       = $q.defer();
    this.viewState.isOverLoad       = false;
    this.viewState.isOverLoadReport = true;
    // if (!this.onlineOfflineService.online) {
    //   this.viewState.isOverLoad = true ;
    //   return defer.resolve(true);
    // } else {
    let _query = this.apiUrlManager.get('salesreport', this.baseUrl);
    this.requestService.makePost(_query, report)
        .subscribe((data) => {
                     if (_.isObject(data)) {
                       this.convertDetailItemData(data['items'], data['group_data'], data['item_detail']);
                       this.viewState.isOverLoad       = true;
                       this.viewState.isOverLoadReport = false;
                       this.updateOverLoadSteam().next();
                       return defer.resolve(true);
                     } else {
                       this.viewState.isOverLoad       = true;
                       this.viewState.isOverLoadReport = false;
                       this.updateOverLoadSteam().next();
                       this.toast.error("Some problem occur when load data sales report");
                       return defer.resolve(false);
                     }
                   },
                   (e) => {
                     this.toast.error("Some problem occur when load data sales report");
                     this.viewState.isOverLoad       = false;
                     this.viewState.isOverLoadReport = false;
                     this.updateOverLoadSteam().next();
                     return defer.resolve(false);
                   });
    return defer.promise;
    // }
  }
  
  convertDetailItemData(itemsData, group_data_report_type , itemDetail) {
    let itemSeach ;
    
    if(itemDetail == "Totals"){
      // item detail cho sale summary
      itemSeach =  this.viewData['totalInHontical'];
    }else{
      itemSeach = _.find(this.viewData['items'], (item) => {
        if (item['value'] === itemDetail) {
          return item;
        }
      });
      // push item want view more detail to top
      let cloneItem = _.indexOf(this.viewData['items'], itemSeach);
      this.viewData['items'].splice(cloneItem, 1);
    }
    if(!!itemSeach){
    itemSeach['item_details'] = [];
    // start get data group by report type value
    _.forEach(group_data_report_type, (report_type_data) => {
      let report_type = [];
      let compare_value = this.viewDataFilter['compare_value'];
      report_type['name'] = report_type_data['value'];
      _.forEach(itemsData, (item) => {
        let model = _.find(item['value'], function (option) {
          if (_.isObject(option) && option.hasOwnProperty('data_report_type') &&
              option['data_report_type'] == report_type_data['data'])
            return option;
        });
        if (model) {
          // dang de la grand_total vi chi co 1 truong hop get them data la payment_method
          if (this.viewDataFilter['report_type'] == "payment_method") {
            report_type[ReportHelper.convertDate(item['data'], compare_value)] = parseFloat(model['grand_total']);
          } else {
            report_type[ReportHelper.convertDate(item['data'], compare_value)] = parseFloat(model['revenue']);
          }
          _.forEach(ReportHelper.getListMeasureByReportType(this.viewDataFilter['report_type'])['data'], (measure) => {
            if (this.checkCalculateMeasureData(measure['label'])) {
              if (measure['label'] == "First Sale") {
                if (!report_type.hasOwnProperty(measure['label']) || model[measure['value']] < report_type[measure['label']]) {
                  report_type[measure['label']] = model[measure['value']];
                }
              }else if( measure['label'] == "Last Sale"){
                if (!report_type.hasOwnProperty(measure['label']) || model[measure['value']] > report_type[measure['label']]) {
                  report_type[measure['label']] = model[measure['value']];
                }
              } else {
                if (!report_type.hasOwnProperty(measure['label'])) {
                  report_type[measure['label']] = parseFloat(model[measure['value']]);
                } else {
                  report_type[measure['label']] += parseFloat(model[measure['value']]);
                }
              }
            }
          });
        } else {
          report_type[ReportHelper.convertDate(item['data'], compare_value)] = "--"
        }
      });
      // Object.assign()
      itemSeach['item_details'].push(report_type);
    });
    _.forEach(itemSeach['item_details'], (item)=> {
      this.calculateItemData(item);
    });
      itemSeach['display_item_detail'] = true;
      if(itemDetail != "Totals"){
      this.viewData['items'].unshift(itemSeach);
      }
    }
    this.resolveItemDisplay();
  }
  
  resolveItemDisplay(measureLabel: string = null,isFilter = false) {
      if (!isFilter) {
        if (measureLabel != this._sortData) {
          this.isSortAsc = true;
        } else {
          this.isSortAsc = !this.isSortAsc;
        }
      }
      if(measureLabel != null){
      this._sortData = measureLabel;
      }
    let listDataSoft = _.filter(this.viewData['items'], function (item) {
      return item['display_item_detail'] != true ;
    });
    this.viewData['items'] =  _.filter(this.viewData['items'], function (item) {
      return item['display_item_detail'] == true ;
    });
      // mac dinh sort desc
    listDataSoft = _.sortBy(listDataSoft, [(item) => {
        if (this._sortData == 'First Sale' || this._sortData == 'Last Sale') {
          return _.toLower(item[this._sortData]);
        } else {
          return parseFloat(item[this._sortData]);
        }
      }]);
      if (this.isSortAsc) {
        //noinspection TypeScriptUnresolvedFunction
        listDataSoft = _.reverse(listDataSoft);
      }
    this.viewData['items'] = _.concat(this.viewData['items'], listDataSoft);
    this.viewState.isOverLoad = true;
    this.updateView().next();
  }
  
  getChangeBaseUrlStream() {
    if (!this.stream.hasOwnProperty('change_page')) {
      this.stream.change_page = new Subject();
      this.stream.change_page = <any>this.stream.change_page.share();
    }
    return this.stream.change_page;
  }
  
  updateView(){
    if(!this.stream.hasOwnProperty('refreshSaleReport')){
    this.stream.refreshSaleReport = new Subject();
    this.stream.refreshSaleReport = <any>this.stream.refreshSaleReport.share();
    }
    return this.stream.refreshSaleReport;
  }
  
  updateOverLoadSteam(){
    if (!this.stream.hasOwnProperty('over_loadding')) {
      this.stream.over_loadding = new Subject();
      this.stream.over_loadding = <any>this.stream.over_loadding.share();
    }
    return this.stream.over_loadding;
  }
}

