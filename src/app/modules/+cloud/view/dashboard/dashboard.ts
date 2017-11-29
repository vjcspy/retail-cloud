import {Component, ElementRef, OnInit, AfterViewInit, ViewChild, OnDestroy,} from '@angular/core';

const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {DashBoardHelper} from "../../R/dashboard/helper";

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html',
             styleUrls: [
               './dashboard.scss'
             ],
           })
export class DashboardPage implements AfterViewInit, OnDestroy {
  @ViewChild('chart') public chartEl: ElementRef;
  
  private _barchart: any;
  public ngAfterViewInit() {
   let barchart =  this.initBarChart();
    if (this.chartEl && this.chartEl.nativeElement) {
      barchart.chart = {
        type: 'bar',
        renderTo: this.chartEl.nativeElement
      };
      
      this._barchart = new Highcharts.Chart(barchart);
    };
  }
  
  private initBarChart():any {
    return {
      title: {
        text: '',
        style: {
          display: 'none'
        }
      },
      subtitle: {
        text: '',
        style: {
          display: 'none'
        }
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        startOnTick: false,
        labels: {
          enabled: false
        },
        categories: [''],
        lineWidth: 0,
        tickWidth: 0,
      },
      yAxis: {
        // minPadding: -10,
        // maxPadding: -10,
        labels: {
          enabled: false,
        },
        categories: ['Jan', 'Feb', 'Mar', 'Apr'],
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
          data: [12.395 - 9.25, 12.395 - 7.5, 12.395 - 2, 12.395 - 1],
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
          data: [9.25, 7.5, 2, 1],
          color: '#0196FC',
          dataLabels: {
            format: ['Outlet A'],
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
  
  protected getListTimePeriodPicker() {
    let data = [
      {id: 1, label: "Day", value: "day"},
      {id: 2, label: "Week", value: "week"},
      {id: 3, label: "Month", value: "month"},
      {id: 4, label: "Year", value: "year"},
    ];
    return {
      data: data,
      isMultiSelect: false,
      label: "Time Period Picker",
      value: "time_period_picker"
    }
  }
  
  protected getListScope() {
    let data = [
      {id: 1, label: "Outlet", value: "outlet"},
      {id: 2, label: "Website", value: "website"},
      {id: 3, label: "Store View", value: "storeview"}
    ];
    return {
      data: data,
      isMultiSelect: false,
      label: "Scope",
      value: "scope"
    }
  }
  
  protected getListCurrency() {
    let data = [
      {id: 1, label: "USD", value: "usd"},
      {id: 2, label: "VND", value: "vnd"},
      {id: 3, label: "THB", value: "thb"}
    ];
    return {
      data: data,
      isMultiSelect: false,
      label: "Currency",
      value: "currency"
    }
  }
  
  protected getListTypeChart() {
    return DashBoardHelper.getListTypeChart();
  }
}
