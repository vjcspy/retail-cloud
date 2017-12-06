import {Component, Input} from '@angular/core';
import {ReportDashboardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-chart',
             templateUrl: 'retail-dashboard-chart.html'
           })

export class RetailDashboardChart {
  @Input('typeChart') typeChart    = [];
  @Input('data_view') viewData     = [];
  
  getTitleDashBoardChart() {
    let typeChart = this.typeChart;
    let chart     = _.find(ReportDashboardHelper.getWidgets()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
  
  getDataBarChart() {
    if (typeof  this.viewData != "undefined"  && typeof  this.typeChart != "undefined") {
      let data = {
        scope_Names: [],
        chart_data: [],
        chart_type : this.typeChart
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
}
