import {Component, Input} from '@angular/core';
import {DashBoardHelper} from "../../../R/dashboard/helper";
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'retail-dashboard-chart',
             templateUrl: 'retail-dashboard-chart.html'
           })

export class RetailDashboardChart {
  @Input('typeChart') typeChart;
  
  getTitleDashBoardChart() {
    let typeChart = this.typeChart;
    let chart     = _.find(DashBoardHelper.getListTypeChart()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
}
