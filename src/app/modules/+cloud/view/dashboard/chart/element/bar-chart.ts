import {Component,Input} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'bar-chart',
             templateUrl: 'bar-chart.html'
           })

export class BarChart {
  @Input('data_bar_chart') viewData;
}
