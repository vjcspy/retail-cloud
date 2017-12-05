import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'chart-line-time',
             templateUrl: 'chart-line-time.html'
           })

export class ChartLineTime implements AfterViewInit, OnDestroy {
  @Input('typeChart') typeChart    = [];
  @ViewChild('chart_line_time') public chartEl: ElementRef;
  private _barchart: any;
  
  public ngAfterViewInit() {
    let barchart = this.initBarChart();
    if (this.chartEl && this.chartEl.nativeElement) {
      barchart.chart = {
        type: 'line',
        renderTo: this.chartEl.nativeElement
      };
      
      this._barchart = new Highcharts.Chart(barchart);
    }
    ;
  }
  
  private initBarChart(): any {
    return {
      title: {
        text: ''
      },
  
      subtitle: {
        text: ''
      },
  
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
    this._barchart.destroy();
  }
  
  getTitleDashBoardChart() {
    let typeChart = this.typeChart;
    let chart     = _.find(ReportDashboardHelper.getWidgets()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
}
