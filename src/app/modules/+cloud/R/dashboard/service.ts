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
    update_status : new Subject(),
    update_view: new Subject(),
    change_scope : new Subject()
  };
  
  public viewDataFilter   = {};
  public viewData         = {};

  public viewState = {
    isOverLoad: false
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
      isOverLoad: false,
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
    this.viewData = {
      list_date_filter: [],
      items: [],
      topUser : [],
      product_sold : [],
      product_trend_data : []
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
  
  getDashboardReport() {
      let postData = this.initRequestReportData();
      this.postDashboardReport(postData);
  }
  
  private postDashboardReport(report) {
    let defer = $q.defer();
    this.viewState.isOverLoad = false ;
    this.updateStatus().next();

    let _query = this.apiUrlManager.get('dashboard', this.baseUrl);
    this.requestService.makePost(_query, report)
        .subscribe(
          (data) => {
            if (_.isObject(data)) {
              this.convertData(data);
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
  
  convertData(itemsData) {
    this.viewData = {
      list_date_filter: [],
      items: [],
      topUser : [],
      product_sold : [],
      product_trend_data : []
    };
    this.viewData['current_currency'] = itemsData['current_currency'];
    this.viewData['list_date_filter'] = itemsData['list_date_filter'];
    this.viewData['topUser'] = itemsData['top_User'];
    this.viewData['product_sold'] = itemsData['product_sold'];
    this.viewData['product_trend_data'] = itemsData['product_sold_trend_data'];
    _.forEach(ReportDashboardHelper.getWidgets()['data'], widget => {
      let data = {
        name: widget['label'],
        type: widget['value'],
        data: []
      };
    
      _.forEach(itemsData['series'], scope => {
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
    this.viewState['isOverLoad'] = true;
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
    if(!this.stream.hasOwnProperty('update_view')){
    this.stream.update_view = new Subject();
    this.stream.update_view = <any>this.stream.update_view.share();
    }
    return this.stream.update_view;
  }
  
  updateStatus(){
    if(!this.stream.hasOwnProperty('update_status')){
      this.stream.update_status = new Subject();
      this.stream.update_status = <any>this.stream.update_status.share();
    }
    return this.stream.update_status;
  }
  
}

