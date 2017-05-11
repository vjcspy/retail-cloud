import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {DashboardAPI} from "../../../../cloud/services/api/data/dashboard";
import {AppService} from "../../../../app.service";

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html'
           })
export class DashboardPage implements OnInit {
  @ViewChild('dashChartRevenue') protected dashChartRevenue: ElementRef;
  protected _widgets = {
    'revenue': {
      name: "Revenue",
      type: 'revenue'
    },
    'quantity': {name: "Quantity", type: "quantity"},
    'customer_count': {name: "Customer Count", type: "customer_count"},
    'discount': {name: "Discount", type: "discount"},
    'discount_percent': {name: "Discount Percent", type: "discount_percent"},
    'average_sales': {name: "Average Sales", type: "average_sales"}
  };
  
  protected _data = {
    widget: [],
    period: "7d",
    scope: "outlet",
    startDate: moment(),
    endDate: moment()
  };
  
  constructor(protected dashboardDataService: DashboardAPI,
              protected appService: AppService) { }
  
  ngOnInit() {
    setTimeout(() => {this.initWidgetChart()}, 1000);
  }
  
  initPageJs() {
    jQuery(() => {
      // Init page helpers (Slick Slider plugin)
      if (typeof OneUI != "undefined")
        OneUI.initHelpers('slick');
    });
  }
  
  protected initWidgetChart() {
    this._data['widget'] = [];
    this.dashboardDataService
        .requestWidgetDataDashboard(this._data['scope'],
                                    this._data['period'],
                                    this._data['startDate'].format("YYYY-MM-DD"),
                                    this._data['endDate'].format("YYYY-MM-DD"))
        .then(widgetData => {
          _.forEach(this._widgets, widget => {
            let _data = {
              name: widget['name'],
              type: widget['type'],
              data: []
            };
        
            _.forEach(widgetData['series'], scope => {
              const chartDataOfCurrentScope = _.find(scope['chart_data'], (v, k) => k == widget['type']);
              if (chartDataOfCurrentScope) {
                _data['data'].push({
                                     scopeName: scope['name'],
                                     chartData: chartDataOfCurrentScope
                                   });
              } else {
              }
            });
        
            this._data['widget'].push(_data);
          });
          this.appService.getChangeDetectorStream().next(true);
        });
  }
  
  log(e) {
    console.log(e);
  }
}
