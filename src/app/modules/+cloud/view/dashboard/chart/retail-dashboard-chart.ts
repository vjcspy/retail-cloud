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
    console.log(this.viewData);
    // if(this.viewData != "undefined"){
    //   _.forEach(this.viewData['data'], item => {
    //   console.log(item);
    //   });
    // }
    
    
    let typeChart = this.typeChart;
    let chart     = _.find(ReportDashboardHelper.getWidgets()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
  
  getDataBarChart() {
    return this.viewData;
  }
}
