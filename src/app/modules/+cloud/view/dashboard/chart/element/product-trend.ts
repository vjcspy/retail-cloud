import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'product-trend',
             templateUrl: 'product-trend.html'
           })

export class ProductTrend implements OnInit, OnDestroy {
  @ViewChild('product_trend') public chartEl: ElementRef;
  @Input('data_product_trend') viewData    = [];
  @Input('typeChart') typeChart;
  private _productTrend: any;
  chart_data: any;
  scope_Names: any;
  totalValues: any;
  
  ngOnInit() {
    if (typeof this.viewData != "undefined") {
      this.chart_data = this.viewData['chart_data'];
      this.scope_Names = this.viewData['scope_Names'];
      this.totalValues = [];
      _.forEach(this.viewData['chart_data'], item => {
        this.totalValues = item['item_sold'];
      });
    }
    this.convertChart();
  }
  
  public convertChart() {
    let productTrend = this.initProductTrend();
    if (this.chartEl && this.chartEl.nativeElement) {
      productTrend.chart = {
        backgroundColor:'rgba(255, 255, 255, 0.0)',
        type: 'line',
        renderTo: this.chartEl.nativeElement
      };
      this._productTrend = new Highcharts.Chart(productTrend);
    }
    ;
  }
  
  private initProductTrend(): any {
    return {
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        visible: false
      },
      yAxis: {
        visible: false
      },
      plotOptions: {
        series: {
          lineWidth: 1
        },
        line: {
          lineWidth: 4,
          color: '#1fa79d',
          marker: {
            enabled: false
          },
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: false
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
        name: 'Product Sold',
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
    this._productTrend.destroy();
  }
}
