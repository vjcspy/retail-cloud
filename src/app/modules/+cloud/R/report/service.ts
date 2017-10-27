import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Subject} from "rxjs/Subject";
import * as $q from "q";
import * as _ from "lodash";
import * as moment from "moment";
import {ApiManager} from "../../../../services/api-manager";
import {FormValidationService} from "../../../share/provider/form-validation";
import {RequestService} from "../../../../services/request";
// import {OfflineService} from "../../../share/provider/offline";
import {NotifyManager} from "../../../../services/notify-manager";

@Injectable()
export class SaleReportService {
  protected enableFilter: boolean = false;
  protected stream               = {
    refreshSaleReport: new Subject(),
    change_page : new Subject()
  };
  public measure_selected = {};
  public viewDataFilter   = {};
  public viewData         = {};
  public viewState = {
    isOverLoad: true,
  };
  public _sortData: string;
  public _filterData = {};
  protected isSortAsc: boolean = false;
  public changeReportType: boolean = false;
  
  constructor(protected toast: NotifyManager,
              protected requestService: RequestService,
              protected apiUrlManager: ApiManager,
              protected router: Router,
              protected formValidation: FormValidationService) {
    this.resolveDefaultData();
  }
  
  enableFilterMeasure() {
    this.enableFilter = !this.enableFilter;
    return this.enableFilter;
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
      display_item_detail: false,
      item_view_detail : null,
    };
    this.viewData       = {
      list_date_filter: [],
      items: [],
      additionalData: [],
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
      // 'date_start': this.viewDataFilter['dateStart'],
      // 'date_end': this.viewDataFilter['dateEnd'],
      'is_date_compare': is_date_compare,
      'period_data': {
        'range_type': this.viewDataFilter['compare_value'],
        'type': this.viewDataFilter['compare_type'],
        'count': this.viewDataFilter['compare_count']
      },
      'column': null,
      'filter': this.initDataFilterReport(this._filterData),
    };
    // return data;
  }
  
  convertData(itemsData, group_data_report_type, base_currency) {
    this.viewData = {
      list_date_filter: [],
      items: [],
      additionalData: [],
      totalInVertical: [],
      totalInHontical: [],
      list_item_detail :[]
    };
    _.forEach(itemsData, (item) => {
      
      // start get date time ranger
      let dateRangerConvert = this.convertDate(item['data']);
      this.viewData['list_date_filter'].push(dateRangerConvert);
      item['dateRanger'] = dateRangerConvert;
    });
    // start get data group by report type value
    _.forEach(group_data_report_type, (report_type_data) => {
      let report_type     = [];
      report_type['name'] = _.isObject(report_type_data['value']) ? report_type_data['value']['name'] : (report_type_data['value'] == 'N/A' ? (this.viewDataFilter['report_type'] != 'sales_summary' ? ('No ' + this.getLabelForTitle()) : 'Totals') : report_type_data['value']);
      
      // add them value de filter doi voi nhung data can hien thi them data
      if (this.viewDataFilter['report_type'] == "payment_method" || this.viewDataFilter['report_type'] == "order_status" ||
          this.viewDataFilter['report_type'] == "register" || this.viewDataFilter['report_type'] == "customer"
          || this.viewDataFilter['report_type'] == "region") {
        report_type['value'] = report_type_data['data']
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
          _.forEach(this.getListMeasureByReportType()['data'], (measure) => {
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
    if (this.viewDataFilter['report_type'] == "payment_method") {
      _.forEach(this.viewData['items'], (itemDetail)=> {
        if (itemDetail['value'] == "retailmultiple") {
          this.getMoreItemData('retailmultiple');
        }
      });
    }
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
      this.getAdditionalData(itemsData);
    }
    this.calculateItemData(this.viewData['totalInHontical']);
    
    this.resolveItemDisplay(this._sortData,true);
  }
  
  protected calculateItemData(item) {
    _.forEach(this.getListMeasureByReportType()['data'], (measure) => {
      item[measure['label']] = this.convertItemData(item, measure['label']);
    });
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
    _.forEach(this.getListMeasureByReportType()['data'], (measure) => {
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
  
  getAdditionalData(itemsData) {
    _.forEach(this.getListMeasureByReportType()['data'], (additionalData)=> {
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
      this.viewData['additionalData'].push(additionalItem);
    });
  }
  
  checkCalculateMeasureData(measureLabel) {
    if (measureLabel == "Margin" || measureLabel == "Cart Size" || measureLabel == "Cart Value" ||
        measureLabel == "Cart Value (incl tax)" || measureLabel == "Discount percent" || measureLabel == "Return percent") {
      return false;
    }
    return true;
  }
  
  enterSaleReportStream() {
    if (!this.stream.hasOwnProperty('enter_sale_report')) {
      this.stream['enter_sale_report'] = new Subject();
      this.stream['enter_sale_report']
        .asObservable()
        .filter(() => {
          // return this.onlineOfflineService.online;
        })
        .subscribe(
          async() => {
            let getReport = await this.postSaleReport(this.initRequestReportData());
            if (getReport) {
              this.router.navigate(['/cloud/sale-report']);
            } else {
              this.toast.error('Error');
            }
          }
        );
    }
    return this.stream['enter_sale_report'];
  }
  
  changeMeasure(): void {
    this.measure_selected[this.viewDataFilter['report_type']] = this.viewDataFilter['measures'];
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
    this.viewDataFilter['display_item_detail'] = false;
    if (!force)
      this.initDefaultValueFilter();
    let data = this.initRequestReportData();
    this.postSaleReport(data);
    if (!resetFilet)
      this.enableFilter = false;
    if (changeReportType == true)
      this.changeReportType = true;
  }
  
  private postSaleReport(report) {
    let defer = $q.defer();
    this.viewState.isOverLoad = false ;
    // if (!this.onlineOfflineService.online) {
    //   this.viewState.isOverLoad = true ;
    //   return defer.resolve(true);
    // } else {
      let _query = this.apiUrlManager.get('salesreport');
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
                return defer.resolve(true);
              } else {
                this.viewState.isOverLoad = true ;
                this.toast.error("Some problem occur when load data sales report")
              }
              this.viewState.isOverLoad = true ;
            },
            (e) => {
              this.viewState.isOverLoad = true ;
              return defer.resolve(false);
            }
          );
      return defer.promise;
    // }
  }
  
  getListReportType(): Object {
    return {
      data: [
        {id: 1, label: "Sales Summary", value: "sales_summary"},
        {id: 2, label: "User", value: "user"},
        {id: 3, label: "Outlet", value: "outlet"},
        {id: 4, label: "Register", value: "register"},
        {id: 5, label: "Customer", value: "customer"},
        {id: 6, label: "Customer Group", value: "customer_group"},
        {id: 8, label: "Magento Website", value: "magento_website"},
        {id: 9, label: "Magento Storeview", value: "magento_storeview"},
        {id: 10, label: "Product", value: "product"},
        {id: 11, label: "Manufacturer", value: "manufacturer"},
        {id: 12, label: "Category", value: "category"},
        {id: 13, label: "Payment Method", value: "payment_method"},
        {id: 14, label: "Shipping Method", value: "shipping_method"},
        {id: 15, label: "Order Status", value: "order_status"},
        {id: 16, label: "Currency", value: "currency"},
        {id: 17, label: "Day of week", value: "day_of_week"},
        {id: 18, label: "Hour", value: "hour"},
        {id: 19, label: "Region", value: "region"},
      ],
      isMultiSelect: false,
      label: "Sale Report",
      value: "report_type"
    };
  }
  
  getListMeasure(for_sum: boolean = false): Object {
    let list_measure = [];
    if (for_sum) {
      let report_type = this.viewDataFilter['report_type'];
      if (_.indexOf(['payment_method', 'shipping_method'], report_type) == -1) {
        list_measure = [
          {id: 1, label: "Revenue", value: "revenue"},
          {id: 2, label: "Cost", value: "total_cost"},
          {id: 3, label: "Gross Profit", value: "gross_profit"},
          {id: 4, label: "Margin", value: "margin"},
          {id: 5, label: "Tax", value: "total_tax"},
          {id: 6, label: "Cart Value", value: "cart_value"},
          {id: 7, label: "Order Count", value: "order_count"},
          {id: 8, label: "Total Sales", value: "grand_total"},
        ];
      } else {
        list_measure = [
          {id: 1, label: "Total Sales", value: "grand_total"},
          {id: 2, label: "Order Count", value: "order_count"},
        ];
      }
    } else {
      list_measure = [
        {id: 1, label: "Revenue", value: "revenue"},
        {id: 2, label: "Cost", value: "total_cost"},
        {id: 3, label: "Gross Profit", value: "gross_profit"},
        {id: 4, label: "Margin", value: "margin"},
        {id: 5, label: "Tax", value: "total_tax"},
        {id: 6, label: "Total Sales", value: "grand_total"},
        {id: 7, label: "Cart Size", value: "cart_size"},
        {id: 8, label: "Cart Value", value: "cart_value"},
        {id: 9, label: "Cart Value (incl tax)", value: "cart_value_incl_tax"},
        {id: 10, label: "Customer Count", value: "customer_count"},
        {id: 11, label: "Discount", value: "discount_amount"},
        {id: 12, label: "Discount percent", value: "discount_percent"},
        {id: 13, label: "First Sale", value: "first_sale"},
        {id: 14, label: "Item Sold", value: "item_sold"},
        {id: 15, label: "Last Sale", value: "last_sale"},
        {id: 16, label: "Order Count", value: "order_count"},
        {id: 17, label: "Return percent", value: "return_percent"},
        {id: 18, label: "Return count", value: "return_count"},
        {id: 19, label: "Shipping Amount", value: "shipping_amount"},
        {id: 20, label: "Shipping Tax", value: "shipping_tax"},
        {id: 21, label: "Shipping Tax Refunded", value: "shipping_tax_refunded"},
        {id: 22, label: "Subtotal Refunded", value: "subtotal_refunded"},
        {id: 23, label: "Total Refunded", value: "total_refunded"},
        {id: 24, label:"base_row_total_product", value:'base_row_total_product'}
      ];
    }
    return {
      data: list_measure,
      isMultiSelect: true,
      label: "Measure",
      value: "measure"
    }
  }
  
  getListMeasureByReportType() {
    let listMeasureType = this.getListMeasure()['data'];
    let report_type     = this.viewDataFilter['report_type'];
    let measureList     = _.find(this.getMeasureIdByReportType()['data'], (row) => row['report_type'] == report_type);
    if (_.indexOf(['payment_method', 'shipping_method'], report_type) == -1) {
      _.remove(listMeasureType, function (measure) {
        return _.indexOf(measureList['measureId'], measure['id']) != -1
      });
    } else {
      _.remove(listMeasureType, function (measure) {
        return _.indexOf(measureList['measureId'], measure['id']) == -1
      });
    }
    return {
      data: listMeasureType,
      isMultiSelect: true,
      label: "Mearsure",
      value: "measure"
    }
  }
  
  getMeasureIdByReportType() {
    let list_measure_by_report_type = [
      {id: 1, report_type: "sales_summary", measureId: [17, 18]},
      {id: 2, report_type: "user", measureId: [19, 20, 21]},
      {id: 3, report_type: "outlet", measureId: [19, 20, 21]},
      {id: 4, report_type: "register", measureId: [19, 20, 21]},
      {id: 5, report_type: "customer", measureId: [19, 20, 21]},
      {id: 6, report_type: "customer_group", measureId: [19, 20, 21]},
      {id: 8, report_type: "magento_website", measureId: [19, 20, 21]},
      {id: 9, report_type: "magento_storeview", measureId: [19, 20, 21]},
      {id: 10, report_type: "product", measureId: [19, 20, 21, 23]},
      {id: 11, report_type: "manufacturer", measureId: [19, 20, 21, 23]},
      {id: 12, report_type: "category", measureId: [19, 20, 21, 23]},
      {id: 13, report_type: "payment_method", measureId: [6, 16]},
      {id: 14, report_type: "shipping_method", measureId: [6, 16, 19, 20, 21]},
      {id: 15, report_type: "order_status", measureId: [17, 18, 19, 20, 21, 22, 23]},
      {id: 16, report_type: "currency", measureId: [19, 20, 21]},
      {id: 17, report_type: "day_of_week", measureId: [13, 15, 19, 20, 21]},
      {id: 18, report_type: "hour", measureId: [13, 15, 19, 20, 21]},
      {id: 19, report_type: "region", measureId: [19, 20, 21]},
    ];
    return {
      data: list_measure_by_report_type
    }
  }
  
  getReportTypeData() {
    if (!this.viewDataFilter.hasOwnProperty("report_type")) {
      return this.viewDataFilter['report_type'] = this.getListReportType()['data'][0]['value'];
    }
    return this.viewDataFilter['report_type'];
  }
  
  
  protected convertDate($date) {
    if (_.isObject($date)) {
      let date_start;
      let compare_value = this.viewDataFilter['compare_value'];
      
      if (compare_value == "year") {
        return date_start = moment($date['date_start']).format('YYYY');
      } else if (compare_value == "quarter") {
        return date_start = moment($date['date_start']).format('MMM YYYY');
        
      } else if (compare_value == "month") {
        return date_start = moment($date['date_start']).format('MMM YYYY');
        
      } else if (compare_value == "week") {
        return date_start = moment($date['date_start']).format('LL');
        
      } else if (compare_value == "day") {
        return date_start = moment($date['date_start']).format('LL');
      } else {
        return date_start = moment($date['date_start']).format('lll');
      }
    }
  }
  
  getMeasureSelectedColumn(fource:boolean = false) {
    if (!this.viewDataFilter.hasOwnProperty('measures') || fource) {
      this.viewDataFilter['measures'] = [];
      _.forEach(this.getListMeasure(true)['data'], (measure)=> {
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
  
  applyFilter(force: boolean = false){
    this.formValidation.submit('report-filter', async () => {
      this.getSaleReport(force);
    }, true);
  }
  
  protected initDataFilterReport(dataFilter) {
    let measure     = this.getListMeasureByReportType()['data'];
    let report_type = this.viewDataFilter['report_type'];
    let filterData  = [];
    _.forEach(dataFilter, function (value, key) {
      if (value == 'name' && typeof value != 'undefined') {
        switch (report_type) {
          case 'user':
            filterData.push({
                              "name": 'user_id',
                              "search_value": value
                            });
            break;
          case 'outlet':
            filterData.push({
                              "name": 'outlet',
                              "search_value": value
                            });
            break;
          case 'register':
            filterData.push({
                              "name": 'register',
                              "search_value": value
                            });
            break;
          case 'customer':
            filterData.push({
                              "name": 'customer',
                              "search_value": value
                            });
            break;
          case 'customer_group':
            filterData.push({
                              "name": 'customer_group_code',
                              "search_value": value
                            });
            break;
          case 'magento_website':
            filterData.push({
                              "name": 'website_name',
                              "search_value": value
                            });
            break;
          case 'magento_storeview':
            filterData.push({
                              "name": 'store_name',
                              "search_value": value
                            });
            break;
          case 'payment_method':
            filterData.push({
                              "name": 'payment_method',
                              "search_value": value
                            });
            break;
          case 'shipping_method':
            filterData.push({
                              "name": 'shipping_method',
                              "search_value": value
                            });
            break;
          case 'order_status':
            filterData.push({
                              "name": 'retail_status',
                              "search_value": value
                            });
            break;
          case 'currency':
            filterData.push({
                              "name": 'order_currency_code',
                              "search_value": value
                            });
            break;
          case 'day_of_week':
            filterData.push({
                              "name": 'day_of_week',
                              "search_value": value
                            });
            break;
          case 'hour':
            filterData.push({
                              "name": 'hour',
                              "search_value": value
                            });
            break;
          case 'product':
            filterData.push({
                              "name": 'name',
                              "search_value": value
                            });
            break;
          case 'region':
            filterData.push({
                              "name": 'region',
                              "search_value": value
                            });
            break;
          case 'manufacturer':
            filterData.push({
                              "name": 'manufacturer',
                              "search_value": value
                            });
            break;
          case 'category':
            filterData.push({
                              "name": 'category_name',
                              "search_value": value
                            });
            break;
          default:
            filterData.push({
                              "name": 'name',
                              "search_value": value
                            });
            break;
        }
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
    this.postItemDetail(this.initRequestReportData(null, item_filter))
  }
  
  protected postItemDetail(report) {
    let defer = $q.defer();
    this.viewState.isOverLoad = false ;
    // if (!this.onlineOfflineService.online) {
    //   this.viewState.isOverLoad = true ;
    //   return defer.resolve(true);
    // } else {
      let _query = this.apiUrlManager.get('salesreport');
      this.requestService.makePost(_query, report)
          .subscribe((data) => {
            if (_.isObject(data)) {
              this.convertDetailItemData(data['items'], data['group_data']);
              this.viewState.isOverLoad = true;
              return defer.resolve(true);
            } else {
              this.viewState.isOverLoad = true;
              this.toast.error("Some problem occur when load data sales report")
            }
          });
      return defer.promise;
    // }
  }
  
  convertDetailItemData(itemsData, group_data_report_type) {
    this.viewData['list_item_detail'] = [];
    
    // start get data group by report type value
    _.forEach(group_data_report_type, (report_type_data) => {
      let report_type = [];
      
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
            report_type[this.convertDate(item['data'])] = parseFloat(model['grand_total']);
          } else {
            report_type[this.convertDate(item['data'])] = parseFloat(model['revenue']);
          }
          _.forEach(this.getListMeasureByReportType()['data'], (measure) => {
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
          report_type[this.convertDate(item['data'])] = "--"
        }
      });
      // Object.assign()
      this.viewData['list_item_detail'].push(report_type);
    });
    _.forEach(this.viewData['list_item_detail'], (item)=> {
      this.calculateItemData(item);
    });
    this.viewDataFilter['display_item_detail'] = true;
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
  
  checkIsNumberDecimals(value){
    if (value == null || value == 'N/A' || isNaN(value)|| typeof value == 'undefined' || value == '--' || typeof value == 'string')
      return false;
    else
      return true;
  }
  
  getLabelForTitle(){
    let report_type = this.viewDataFilter['report_type'];
    let reportColumn     = _.find(this.getListReportType()['data'], (row) => row['value'] == report_type);
    return reportColumn['label'];
  }
  
  getListOrderStatus(): Object {
    return {
      data: [
        {id: 1, label: "ConnectPOS Partially Refund - Shipped", value: 33},
        {id: 2, label: "ConnectPOS Partially Refund - Not Shipped", value: 32},
        {id: 3, label: "ConnectPOS Partially Refund", value: 31},
        {id: 4, label: "ConnectPOS Fully Refund", value: 40},
        {id: 5, label: "ConnectPOS Exchange - Shipped", value: 53},
        {id: 6, label: "ConnectPOS Exchange - Not Shipped", value: 52},
        {id: 8, label: "ConnectPOS Exchange", value: 51},
        {id: 9, label: "ConnectPOS Complete - Shipped", value: 23},
        {id: 10, label: "ConnectPOS Complete - Not Shipped", value: 22},
        {id: 11, label: "ConnectPOS Complete", value: 21},
        {id: 12, label: "Magento Status", value: 'null'},
      ],
      isMultiSelect: true,
      label: "Order Status",
      value: "order_status"
    };
  }
  
  getListDayOfWeek(): Object {
    return {
      data: [
        {id: 1, label: "Sunday", value: 1},
        {id: 2, label: "Monday", value: 2},
        {id: 3, label: "Tuesday", value: 3},
        {id: 4, label: "Wednesday", value: 4},
        {id: 5, label: "Thursday", value: 5},
        {id: 6, label: "Friday", value: 6},
        {id: 8, label: "Saturday", value: 7},
      ],
      isMultiSelect: true,
      label: "Day Of Week",
      value: "day_of_week"
    };
  }
  
  getListHour(): Object {
    return {
      data: [
        {id: 1, label: "12 am - 1 am", value: 0},
        {id: 2, label: "1 am - 2 am", value: 1},
        {id: 3, label: "2 am - 3 am", value: 2},
        {id: 4, label: "3 am - 4 am", value: 3},
        {id: 5, label: "4 am - 5 am", value: 4},
        {id: 6, label: "5 am - 6 am", value: 5},
        {id: 7, label: "6 am - 7 am", value: 6},
        {id: 8, label: "7 am - 8 am", value: 7},
        {id: 9, label: "8 am - 9 am", value: 8},
        {id: 10, label: "9 am - 10 am", value: 9},
        {id: 11, label: "10 am - 11 am", value: 10},
        {id: 12, label: "11 am - 12 pm", value: 11},
        {id: 13, label: "12 pm - 1 pm", value: 12},
        {id: 14, label: "1 pm - 2 pm", value: 13},
        {id: 15, label: "2 pm - 3 pm", value: 14},
        {id: 16, label: "3 pm - 4 pm", value: 15},
        {id: 17, label: "4 pm - 5 pm", value: 16},
        {id: 18, label: "5 pm - 6 pm", value: 17},
        {id: 19, label: "6 pm - 7 pm", value: 18},
        {id: 20, label: "7 pm - 8 pm", value: 19},
        {id: 21, label: "8 pm - 9 pm", value: 20},
        {id: 22, label: "9 pm - 10 pm", value: 21},
        {id: 23, label: "10 pm - 11 pm", value: 22},
        {id: 24, label: "11 pm - 12 am", value: 23},
      ],
      isMultiSelect: true,
      label: "Hour",
      value: "hour"
    };
  }
  
  getOptionForFilter() {
    let report_type = this.viewDataFilter['report_type'];
    if (report_type == 'order_status')
      return this.getListOrderStatus();
    else if (report_type == 'day_of_week')
      return this.getListDayOfWeek();
    else
      return this.getListHour();
  }
  
  checkNullValue(value) {
    if (value == null || value == 'N/A' || value == "NaN" || typeof value === 'undefined' || value == NaN)
      return true;
  }
  
  resolveItemDisplay(measureLabel: string = null,isFilter = false) {
    if (measureLabel) {
      if (!isFilter) {
        if (measureLabel != this._sortData) {
          this.isSortAsc = true;
        } else {
          this.isSortAsc = !this.isSortAsc;
        }
      }
      this._sortData = measureLabel;
      // mac dinh sort desc
      this.viewData['items'] = _.sortBy(this.viewData['items'], [(item) => {
        if (this._sortData == 'First Sale' || this._sortData == 'Last Sale') {
          return _.toLower(item[this._sortData]);
        } else {
          return parseFloat(item[this._sortData]);
        }
      }]);
      if (this.isSortAsc) {
        //noinspection TypeScriptUnresolvedFunction
        this.viewData['items'] = _.reverse(this.viewData['items']);
      }
      if (this.viewData['list_item_detail']){
        this.viewData['list_item_detail'] = _.sortBy(this.viewData['list_item_detail'], [(itemDetail) => {
          if (this._sortData == 'First Sale' || this._sortData == 'Last Sale') {
            return _.toLower(itemDetail[this._sortData]);
          } else {
            return parseFloat(itemDetail[this._sortData]);
            
          }
        }]);
        if (this.isSortAsc) {
          //noinspection TypeScriptUnresolvedFunction
          this.viewData['list_item_detail'] = _.reverse(this.viewData['list_item_detail']);
        }
      }
    }
  }
  
  getSearchCustomerStream() {
    if (!this.stream.hasOwnProperty('change_page')) {
      this.stream.change_page = new Subject();
      this.stream.change_page = <any>this.stream.change_page.share();
    }
    return this.stream.change_page;
  }
  
  checkSortAsc(measureLabel) {
    if (measureLabel) {
      if (measureLabel == this._sortData) {
        if (this.isSortAsc){
          return 2;
        } else
          return 3;
      } else
        return 1;
    }
  }
  
  checkDataNullForHidden() {
    if (this.viewData['report_type'] == 'sales_summary') {
      return false;
    } else {
      if (this.viewData['items'].length == 0) {
        return true;
      } else
        return false;
    }
  }
  
  checkDisableFilter() {
    if (this.viewDataFilter['report_type'] == 'sales_summary' && this.viewDataFilter['measures'].length <= 2){
      if ((_.head(this.viewDataFilter['measures']) == 'First Sale' && _.last(this.viewDataFilter['measures']) == 'Last Sale') ||
          (_.head(this.viewDataFilter['measures']) == 'First Sale' && this.viewDataFilter['measures'].length == 1) ||
          (_.head(this.viewDataFilter['measures']) == 'Last Sale' && this.viewDataFilter['measures'].length == 1)
      ){
        this.enableFilter = false;
        return true;
      }
    } else
      return false;
  }
}

