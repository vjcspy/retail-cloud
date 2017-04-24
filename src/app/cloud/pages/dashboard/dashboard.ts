import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashboardDataService} from "../../services/data-managment/client-api/dashboard-data";
import {AppService} from "../../../app.service";

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html'
           })
export class DashboardComponent implements OnInit {
  @ViewChild('dashChartRevenue') protected dashChartRevenue: ElementRef;
  protected _widgets = [
    'revenue', 'quantity', 'customer_count', 'discount', 'discount_percent', 'average_sales'
  ];
  
  protected _data = {
    widget: []
  };
  
  constructor(protected dashboardDataService: DashboardDataService,
              protected appService: AppService) { }
  
  ngOnInit() {
    this.initWidgetChart();
  }
  
  initPageJs() {
    jQuery(() => {
      // Init page helpers (Slick Slider plugin)
      if (typeof OneUI != "undefined")
        OneUI.initHelpers('slick');
    });
  }
  
  protected initWidgetChart() {
    this.dashboardDataService
        .requestWidgetDataDashboard('outlet', '24h', '2017-04-21', '2017-04-21')
        .then(widgetData => {
          _.forEach(this._widgets, widgetName => {
            let _data = {
              name: widgetName,
              type: widgetName,
              data: []
            };
        
            _.forEach(widgetData['series'], scope => {
              const chartDataOfCurrentScope = _.find(scope['chart_data'], (v, k) => k == widgetName);
              if (chartDataOfCurrentScope) {
                _data['data'].push({
                                     scopeName: scope['name'],
                                     chartData: chartDataOfCurrentScope
                                   });
              }
            });
        
            this._data['widget'].push(_data);
          });
          this.appService.getChangeDetectorStream().next(true);
        });
  }
  
}
