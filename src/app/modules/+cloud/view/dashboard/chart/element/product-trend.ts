import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'product-trend',
             templateUrl: 'product-trend.html'
           })

export class ProductTrend implements AfterViewInit, OnDestroy {
  @ViewChild('product_trend') public chartEl: ElementRef;
  private _productTrend: any;
  
  public ngAfterViewInit() {
    let productTrend = this.initProductTrend();
    if (this.chartEl && this.chartEl.nativeElement) {
      productTrend.chart = {
        backgroundColor:'rgba(255, 255, 255, 0.0)',
        type: 'spline',
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
        spline: {
          lineWidth: 4,
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
        data: [434, 523, 577, 698, 971, 131, 133, 175]
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
