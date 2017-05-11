import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'dashboard-widget',
             templateUrl: 'dashboard-widget.component.html',
             styleUrls: ['dash-widget.component.scss']
           })
export class DashboardWidgetComponent implements OnInit, OnChanges {
  @Input('widgetData') widgetData: {
    name: string;
    type: string;
    data: {
      scopeName: string,
      chartData: any
    }
  } = <any>{
    name: ""
  };
  
  @ViewChild('dashChartLine') protected dashChartLine: ElementRef;
  @ViewChild('dashChartBar') protected dashChartBar: ElementRef;
  
  protected _selectedScope: string;
  protected _lineChartData = {label: [], value: []};
  protected _barChartData  = {label: [], value: []};
  protected _totals;
  
  constructor() { }
  
  ngOnInit() {
    this._prepareChartData();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    _.forEach(changes, val => {
      if (val.hasOwnProperty('data')) {}
      this._prepareChartData();
    });
  }
  
  protected _prepareChartData() {
    // prepare lineChart
    if (this._selectedScope) {
      const _scopeChart = _.find(this.widgetData.data, scope => scope['scopeName'] == this._selectedScope);
      if (_scopeChart) {
        this._lineChartData = _scopeChart['chartData'];
      }
    } else {
      let _x = [];
      let _y = [];
      _.forEach(this.widgetData.data, scope => {
        const scopeChartData = scope['chartData'];
        _.forEach(scopeChartData['value'], (v, k) => {
          if (!_x[k]) {
            _x[k] = 0;
          }
          _x[k] += v;
        });
        _y = scopeChartData['label'];
      });
      this._lineChartData = {
        label: _y,
        value: _x
      };
    }
    this._totals = _.round(_.sum(this._lineChartData['value']), 2);
    
    
    // prepare barChart
    let _barChartX  = [];
    let _bartChartY = [];
    _.forEach(this.widgetData.data, (scope, k) => {
      _barChartX[k] = (scope['scopeName']);
      _.forEach(scope['chartData']['value'], (v) => {
        if (!_bartChartY[k])
          _bartChartY[k] = 0;
        _bartChartY[k] += v;
      });
    });
    this._barChartData = {
      label: _barChartX,
      value: _bartChartY
    };
    
    setTimeout(() => {this.initLineChart()}, 1000);
    setTimeout(() => {this.initBarChart()}, 1000);
  }
  
  protected initLineChart() {
    let ctx  = this.dashChartLine.nativeElement;
    let data = {
      labels: this._lineChartData['label'],
      datasets: [
        {
          label: this.widgetData.name,
          fill: true,
          lineTension: 0.1,
          // backgroundColor: "rgba(75,192,192,0.4)",
          // borderColor: "rgba(75,192,192,1)",
          // borderCapStyle: 'butt',
          // borderDash: [],
          // borderDashOffset: 0.0,
          // borderJoinStyle: 'miter',
          // pointBorderColor: "rgba(75,192,192,1)",
          // pointBackgroundColor: "#fff",
          // pointBorderWidth: 1,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: "rgba(75,192,192,1)",
          // pointHoverBorderColor: "rgba(220,220,220,1)",
          // pointHoverBorderWidth: 2,
          // pointRadius: 1,
          // pointHitRadius: 10,
          data: this._lineChartData['value'],
          // spanGaps: false,
        }
      ]
    };
    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          xAxes: [{
            display: true
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }
  
  protected initBarChart() {
    let ctx  = this.dashChartBar.nativeElement;
    let data = {
      labels: this._barChartData['label'],
      datasets: [
        {
          label: this.widgetData.name,
          // backgroundColor: [
          //   'rgba(255, 99, 132, 0.2)',
          //   'rgba(54, 162, 235, 0.2)',
          //   'rgba(255, 206, 86, 0.2)',
          //   'rgba(75, 192, 192, 0.2)',
          //   'rgba(153, 102, 255, 0.2)',
          //   'rgba(255, 159, 64, 0.2)',
          //   'rgba(255, 99, 132, 0.2)',
          // ],
          // borderColor: [
          //   'rgba(255,99,132,1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)',
          //   'rgba(255, 159, 64, 1)',
          //   'rgba(55, 159, 164, 1)',
          // ],
          // borderWidth: 1,
          data: this._barChartData['value'],
          // spanGaps: false
        }
      ]
    };
    new Chart(ctx, {
      type: 'horizontalBar',
      data: data,
      options: {
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              beginAtZero: true
            }
          }]
        },
        // title: {
        //   display: true,
        //   text: 'Custom Chart Title'
        // },
        legend: {
          display: false
        },
      }
    });
  }
}
