import {Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import * as moment from 'moment';
import * as $q from "q";
import * as _ from "lodash";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";

const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';

@Component({
             // moduleId: module.id,
             selector: 'bar-chart',
             templateUrl: 'bar-chart.html'
           })
export class BarChart implements AfterViewInit, OnDestroy {
  @ViewChild('chart') public chartEl: ElementRef;
                             item    = [0, 2113.4, 0, 152.96, 713.8, 0];
                             // item    = [0, 2113.4];
                             maxItem = 2113.4 * 1.33;
                             value   = ['Thanhnt1', 'demo outlet', 'Ha Noi', '120', 'Hhehee', '1asd'];
                             // value   = ['Thanhnt1', 'demo outlet'];
  private _barchart: any;
  
  public ngAfterViewInit() {
    let barchart = this.initBarChart();
    if (this.chartEl && this.chartEl.nativeElement) {
      barchart.chart = {
        type: 'bar',
        renderTo: this.chartEl.nativeElement
      };
      
      this._barchart = new Highcharts.Chart(barchart);
    }
    ;
  }
  
  private initBarChart(): any {
    return {
      title: {text: '', style: {display: 'none'}},
      subtitle: {text: '', style: {display: 'none'}},
      legend: {enabled: false},
      xAxis: {
        categories: this.value,
        labels: {enabled: false},
        lineWidth: 0,
        tickWidth: 0,
      },
      yAxis: {
        labels: {
          enabled: false,
        },
        gridLineWidth: 0,
        title: null
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          pointPadding: 0.3,
          groupPadding: -0.2,
          stacking: 'percent'
        }
      },
      tooltip: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          name: 'Total',
          data: [this.maxItem - 0, this.maxItem - 2113.4, this.maxItem - 0, this.maxItem - 152.96 , this.maxItem -713.8, this.maxItem - 0],
          // data: [this.maxItem - 0, this.maxItem - 2113.4],
          value: this.value,
          color: '#989898',
          dataLabels: {
            formatter: function () {
              return this.total - this.y;
            },
            enabled: true,
            align: 'right',
            color: "#000000"
          }
        },
        {
          showInLegend: false,
          name: 'Value',
          data: this.item,
          color: '#0196FC',
          dataLabels: {
            formatter: function () {
              return this.x;
            },
            enabled: true,
            align: 'left',
            color: "#000000"
          }
        }
      ]
    };
  }
  
  public ngOnDestroy() {
    this._barchart.destroy();
  }
}
