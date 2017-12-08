import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";
import {count} from "rxjs/operator/count";

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
  @Input('typeChart') typeChart = [];
  @Input('data_view') viewData  = [];
  @Input('period') period: string;
  
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
      _.chain(this.viewData['data'])
       .map((d) => d['chartData'])
       .reduce((result, value) => {
         _.forEach(value, (_v, _k) => {
           if (!result[_k]) {
             result[_k] = 0;
           }
           result[_k] += parseFloat(_v);
         });
         data.chart_data.push(result);
         return result;
       }, []).value();
      return data;
    }
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
