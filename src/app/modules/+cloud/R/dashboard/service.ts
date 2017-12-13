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
// import {OnlineOfflineModeService} from "../../../../services/online-offline-mode.service";

@Injectable()
export class DashboardReportService {

  @LocalStorage('baseUrl')
  public baseUrl: string;

  protected stream               = {
    refreshDashboardReport: new Subject(),
    change_scope : new Subject()
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
      dateStart: moment().format("Do MMM YYYY"),
      dateEnd: moment().format("Do MMM YYYY")
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
   let dateStart = moment(this.viewDataFilter['dateStart'], "Do MMM YYYY").format('YYYY-MM-DD 00:00:00');
   let dateEnd = moment(this.viewDataFilter['dateEnd'], "Do MMM YYYY").format('YYYY-MM-DD 23:59:59');
    return {
      'scope': this.getScopeData(),
      'period': this.viewDataFilter['period'],
      'dateStart': moment(dateStart).format() + '/' + dateStart,
      'dateEnd': moment(dateEnd).format() + '/' + dateEnd
      // 'dateStart': moment(this.viewDataFilter['dateStart'], "Do MMM YYYY").format("YYYY-MM-DD") ,
      // 'dateEnd': moment(this.viewDataFilter['dateEnd'], "Do MMM YYYY").format("YYYY-MM-DD") ,
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
              this.convertData(data['series'],data['list_date_filter'], data['product_sold'], data['product_sold_trend_data']);
              
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
  
  convertData(itemsData , listDateFilter, productSold, productTrendData) {
    this.viewData = {
      list_date_filter: [],
      items: []
    };
    this.viewData['list_date_filter'] = listDateFilter;
    this.viewData['product_sold'] = productSold;
    this.viewData['product_trend_data'] = productTrendData;
    // _.forEach(ReportDashboardHelper.getWidgets()['data'] , widget =>{
    //   let _data = {
    //     name: widget['label'],
    //     type: widget['value'],
    //     data: []
    //   };
    //   _.forEach(itemsData, (scope) => {
    //     _data["data"].push({
    //               "name": scope['name'],
    //               "value": scope['chart_data'][widget['value']]
    //             })
    //   });
    //   this.viewData['items'].push(_data);
    // });
    
    _.forEach(ReportDashboardHelper.getWidgets()['data'], widget => {
      let data = {
        name: widget['label'],
        type: widget['value'],
        data: []
      };
    
      _.forEach(itemsData, scope => {
        const chartDataOfCurrentScope = _.find(scope['chart_data'], (v, k) => k == widget['value']);
        if (chartDataOfCurrentScope) {
          data['data'].push({
                               scopeName: scope['name'],
                               chartData: chartDataOfCurrentScope
                             });
        } else {
        }
      });
    
      this.viewData['items'].push(data);
    });
    this.updateView().next();
  }
  
  getChangeBaseUrlStream() {
    if (!this.stream.hasOwnProperty('change_scope')) {
      this.stream.change_scope = new Subject();
      this.stream.change_scope = <any>this.stream.change_scope.share();
    }
    return this.stream.change_scope;
  }

  updateView(){
    if(!this.stream.hasOwnProperty('refreshDashboardReport')){
    this.stream.refreshDashboardReport = new Subject();
    this.stream.refreshDashboardReport = <any>this.stream.refreshDashboardReport.share();
    }
    return this.stream.refreshDashboardReport;
  }
  
}

