import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashboardDataService} from "../../services/data-managment/client-api/dashboard-data";
import {AppService} from "../../../app.service";

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html'
           })
export class DashboardComponent implements OnInit {
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
        .requestWidgetDataDashboard('outlet', '24h', '2017-04-25', '2017-04-25')
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
  
}
