import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";
import * as _ from "lodash";
import {DashboardReportService} from "../../../../R/dashboard/service";

@Component({
             // moduleId: module.id,
             selector: 'chart-line-time',
             templateUrl: 'chart-line-time.html'
           })

export class ChartLineTime implements AfterViewInit, OnDestroy, OnInit {
  @Input('typeChart') typeChart    = [];
  @ViewChild('chart_line_time') public chartEl: ElementRef;
  private _chartLineTime: any;
  
  constructor(protected dashboardReportService: DashboardReportService) {}
  
  ngOnInit() {
    this.getViewData();
  }
  
  public ngAfterViewInit() {
    let chartLineTime = this.initChartLineTime();
    if (this.chartEl && this.chartEl.nativeElement) {
      chartLineTime.chart = {
        type: 'line',
        renderTo: this.chartEl.nativeElement
      };
      
      this._chartLineTime = new Highcharts.Chart(chartLineTime);
    }
    ;
  }
  
  private initChartLineTime(): any {
    return {
      title: {
        text: ''
      },
  
      subtitle: {
        text: ''
      },
  
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
        }
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: true
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
  
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
                 this.x + ': ' + this.y;
        }
      },
  
      series: [{
        name: this.getTitleDashBoardChart(),
        data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
      }],
  
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false,
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle'
            }
          }
        }]
      }
    };
  }
  
  public ngOnDestroy() {
    this._chartLineTime.destroy();
  }
  
  getTitleDashBoardChart() {
    let typeChart = this.typeChart;
    let chart     = _.find(ReportDashboardHelper.getWidgets()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
  
  public getViewData() {
    console.log(this.dashboardReportService.viewData['items']);
    return this.dashboardReportService.viewData['items'];
  }
}
