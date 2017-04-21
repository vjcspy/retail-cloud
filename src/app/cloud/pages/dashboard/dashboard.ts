import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
             selector: 'z-dashboard',
             templateUrl: 'dashboard.html'
           })
export class DashboardComponent implements OnInit {
  @ViewChild('dashChartRevenue') protected dashChartRevenue: ElementRef;
  
  constructor() { }
  
  ngOnInit() {
    this.initPageJs();
    setTimeout(() => {this.initRevenueChart()}, 2000);
  }
  
  initPageJs() {
    jQuery(() => {
      // Init page helpers (Slick Slider plugin)
      if (typeof OneUI != "undefined")
        OneUI.initHelpers('slick');
    });
  }
  
  protected initRevenueChart() {
    let ctx     = this.dashChartRevenue.nativeElement;
    let data    = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40],
          spanGaps: false,
        }
      ]
    };
    let myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          xAxes: [{
            display: false
          }]
        }
      }
    });
  }
}
