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
import {ReportDashboardHelper} from "./helper";
import {OnlineOfflineModeService} from "../../../../services/online-offline-mode.service";

@Injectable()
export class DashboardReportService {

  @LocalStorage('baseUrl')
  public baseUrl: string;

  protected stream               = {
    refreshDashboardReport: new Subject(),
    change_scope : new Subject(),
    over_loadding : new Subject()
  };
  
  public viewDataFilter   = {};
  public viewData         = {};

  public viewState = {
    isOverLoad: true
  };

  constructor(protected toast: NotifyManager,
              protected requestService: RequestService,
              protected apiUrlManager: ApiManager,
              protected router: Router){
    this.resolveDefaultData();
  }
  
  resolveDefaultData() {
    this.viewData       = {};

    this.viewState        = {
      isOverLoad: true,
    };
    this.initDefaultValue();
  }

  private initDefaultValue() {
    this.viewDataFilter = {
      scope: this.getScopeData(),
      period: '7d',
      dateStart: moment(),
      dateEnd: moment()
    };
    this.viewData       = {
      list_date_filter: [],
      items: []
    };
  }
  
  getScopeData() {
    if (!this.viewDataFilter.hasOwnProperty("scope")) {
      return this.viewDataFilter['scope'] = ReportDashboardHelper.getListScope()['data'][0]['value'];
    }
    return this.viewDataFilter['scope'];
  }

  initRequestReportData() {
    return {
      'scope': this.getScopeData(),
      'period': this.viewDataFilter['period'],
      // 'dateStart': moment(this.viewDataFilter['dateStart']).format() + '/' + this.viewDataFilter['dateStart'] ,
      // 'dateEnd': moment(this.viewDataFilter['dateEnd']).format() + '/' + this.viewDataFilter['dateEnd']
      'dateStart': this.viewDataFilter['dateStart'].format("YYYY-MM-DD") ,
      'dateEnd':this.viewDataFilter['dateEnd'].format("YYYY-MM-DD")
    };
  }
  
  getDashboardReport(force: boolean = false) {
    if (!force) {
      let postData = this.initRequestReportData();
      this.postDashboardReport(postData);
    }
  }
  
  private postDashboardReport(report) {
    let defer = $q.defer();
    this.viewState.isOverLoad = false ;
    // this.viewState.isOverLoadReport = true ;
    // if (!this.onlineOfflineService.online) {
    //   this.viewState.isOverLoad = true ;
    //   return defer.resolve(true);
    // } else {
    let _query = this.apiUrlManager.get('dashboard', this.baseUrl);
    this.requestService.makePost(_query, report)
        .subscribe(
          (data) => {
            if (_.isObject(data)) {
              this.convertData(data['series'],data['list_date_filter']);
              
              this.viewState.isOverLoad = true ;
              // this.viewState.isOverLoadReport = false ;
              return defer.resolve(true);
            } else {
              this.viewState.isOverLoad = true ;
              // this.viewState.isOverLoadReport = false ;
              this.toast.error("Some problem occur when load data dashboard");
            }
          },
          (e) => {
            this.toast.error("Some problem occur when load data dashboard");
            this.viewState.isOverLoad = false ;
            // this.viewState.isOverLoadReport = false ;
            return defer.resolve(false);
          }
        );
    return defer.promise;
    // }
  }
  
  convertData(itemsData , $listDateFilter) {
    this.viewData = {
      list_date_filter: [],
      items: [],
    };
    let data = [];
    _.forEach(ReportDashboardHelper.getWidgets()['data'] , (widget)=>{
    data[widget['value']] = [];
      _.forEach(itemsData, (items) => {
        data[widget['value']].push({
                  "name": items['name'],
                  "value": items['chart_data'][widget['value']]
                })
      });
    });
    console.log(data);
    
    
   
  }

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
  
}

