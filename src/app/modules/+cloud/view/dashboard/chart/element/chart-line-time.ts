import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";
import * as _ from "lodash";
import * as moment from "moment";
import {DashboardReportService} from "../../../../R/dashboard/service";

@Component({
             // moduleId: module.id,
             selector: 'chart-line-time',
             templateUrl: 'chart-line-time.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ChartLineTime implements OnDestroy, OnInit {
  @Input('typeChart') typeChart: string;
  @ViewChild('chart_line_time') public chartEl: ElementRef;
  @Input('data_chart_line_time') viewData    = [];
  
  chart_data: any;
  scope_Names: any;
  totalValues: any;
  
  private _chartLineTime: any;
  
  constructor(protected dashboardReportService: DashboardReportService) {}
  
  ngOnInit() {
    if (typeof this.viewData != "undefined") {
      this.chart_data = this.viewData['chart_data'];
      this.scope_Names = this.viewData['scope_Names'];
      this.totalValues = [];
      _.forEach(this.viewData['chart_data'], item => {
        this.totalValues = item;
      });
    }
    this.convertChart();
  }
  
  getListDataFilter() {
    let list_date_range = [];
    _.forEach(this.dashboardReportService.viewData['list_date_filter'], item => {
      if (item.hasOwnProperty('date_start')) {
        list_date_range.push(item['date_start']);
      }
    });
    return _.map(list_date_range, function (date) {
      return moment(date, "YYYY-MM-DD").format("Do MMM");
    });
  }
  
  public convertChart() {
    let chartLineTime = this.initChartLineTime(this.typeChart);
    if (this.chartEl && this.chartEl.nativeElement) {
      chartLineTime.chart = {
        type: 'line',
        renderTo: this.chartEl.nativeElement
      };
      
      this._chartLineTime = new Highcharts.Chart(chartLineTime);
    }
    ;
  }
  
  private initChartLineTime(type_chart): any {
    return {
      title: {
        text: ''
      },
  
      subtitle: {
        text: ''
      },
  
      xAxis: {
        categories: this.getListDataFilter(),
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
          color: '#1fa79d',
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
        padding: 25,
        borderRadius: 8,
        useHTML: true,
        style:{
          whiteSpace: 'pre-wrap'
        },
        valueDecimals: 2,
        formatter: function () {
          let currency_symbol = '';
          let discount_symbol = '';
          switch (type_chart) {
            case 'discount_percent':
              discount_symbol = '%';
              this.y = _.round(this.y*100, 2);
              break;
            case 'customer_count':
              currency_symbol = '';
              break;
            case 'quantity':
              currency_symbol = '';
              break;
            default:
              currency_symbol = '$';
              this.y = _.round(this.y, 2);
              break;
          }
          return '<b style="font-size: 30px; text-align: center; font-weight: 100; margin: 0 auto; display: block">' + currency_symbol + this.y.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + discount_symbol + '</b><br/><br/>' +
                 moment(this.x, 'Do MMM').format('ddd Do MMM, YYYY');
        }
      },
  
      series: [{
        name: this.getTitleDashBoardChart(),
        data: this.totalValues
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
}
