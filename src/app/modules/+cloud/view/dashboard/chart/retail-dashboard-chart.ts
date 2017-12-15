import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";
import {count} from "rxjs/operator/count";
import {DashboardReportService} from "../../../R/dashboard/service";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-chart',
             templateUrl: 'retail-dashboard-chart.html',
             styleUrls: [
               './retail-dashboard-chart.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class RetailDashboardChart {
  @Input('typeChart') typeChart: string;
  @Input('data_view') viewData  = [];
  @Input('period') period: string;
  
  constructor(protected dashboardReportService: DashboardReportService) {}
  
  getTitleDashBoardChart() {
    let typeChart = this.typeChart;
    let chart     = _.find(ReportDashboardHelper.getWidgets()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
  
  getDataBarChart() {
    if (typeof  this.viewData != "undefined" && typeof  this.typeChart != "undefined") {
      let data = {
        scope_Names: [],
        chart_data: [],
        chart_type: this.typeChart
      };
      _.forEach(this.viewData['data'], item => {
        if (item.hasOwnProperty('chartData') && item.hasOwnProperty('scopeName')) {
          data.scope_Names.push(item['scopeName']);
          data.chart_data.push(_.last(item['chartData']));
        }
      });
      return data;
    }
  }
  
  getDataChartLineTime() {
    if (typeof  this.viewData != "undefined" && typeof  this.typeChart != "undefined") {
      let data = {
        scope_Names: [],
        chart_data: [],
        chart_type: this.typeChart
      };
      _.forEach(this.viewData['data'], item => {
        if (item.hasOwnProperty('chartData') && item.hasOwnProperty('scopeName')) {
          data.scope_Names.push(item['scopeName']);
        }
      });
      
      if (this.typeChart === 'average_sales') {
        let totalAverageRevenue = this.calculateAverageWidget('revenue', 'quantity');
        data.chart_data.push(totalAverageRevenue);
      } else if (this.typeChart === 'discount_percent') {
        let totalDiscountPercent = this.calculateAverageWidget('discount', 'revenue');
        data.chart_data.push(totalDiscountPercent);
      } else {
        let totalWidget = this.calculatedTotalWidget(this.viewData);
        data.chart_data.push(totalWidget);
      }
      return data;
    }
  }
  
  calculateAverageWidget(dividend, divisor) {
    let dividendData = _.find(this.dashboardReportService.viewData['items'], (row) => { return row['type'] === dividend; });
    let totalDividend = this.calculatedTotalWidget(dividendData);
  
    let divisorData = _.find(this.dashboardReportService.viewData['items'], (row) => { return row['type'] === divisor; });
    let totalDivisor = this.calculatedTotalWidget(divisorData);
  
    let totalAverageRevenue = totalDividend.map(function(n, i) { return n / (totalDivisor[i] === 0 ? 1 : totalDivisor[i]); });
    
    return totalAverageRevenue;
  }
  
  calculatedTotalWidget(widgetData) {
    let data = _.chain(widgetData['data'])
     .map((d) => d['chartData'])
     .reduce((result, value) => {
       _.forEach(value, (_v, _k) => {
         if (!result[_k]) {
           result[_k] = 0;
         }
         result[_k] += parseFloat(_v);
       });
       return result;
     }, []).value();
    return data;
  }
  
  getDataChangeValue() {
    let data = { };
  
    _.forEach(this.getDataChartLineTime()['chart_data'], item => {
      data['change_value'] = parseFloat(item[item.length -1]) - parseFloat(item[item.length -2]);
      data['total'] = _.last(item);
      data['percent'] = Math.abs(parseFloat(item[item.length -2]) === 0 ? 1 : ((parseFloat(item[item.length -1]) - parseFloat(item[item.length -2]))/parseFloat(item[item.length -2])));
      data['change'] = data['change_value'] > 0 ? 1 : (data['change_value'] < 0 ? -1 : 0);
    });
    
    return data;
  }
  
  getLabelForChange() {
    let change = this.getDataChangeValue()['change'];
    let data = {};
    data['label_previous'] = _.find(ReportDashboardHelper.getListTimePeriodPicker()['data'], (row) => row['value'] === this.period);
    data['label_change'] = change > 0 ? 'Up' : (change < 0 ? 'Down' : 'No Change');
    return data;
  }
  
  getBaseCurreny() {
    return '$';
  }
}
