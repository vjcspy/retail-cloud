import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {SalesReportState} from "../../R/sales-report/sales-report.reducer";
import {ReportState} from "../../R/index";

@Component({
             selector: 'report-sales-container',
             templateUrl: 'sales-container.html'
           })
export class ReportSalesContainer implements OnInit {
  protected salesReportState$: SalesReportState;
  
  constructor(private store: Store<ReportState>) {
    this.salesReportState$ = this.store.select('salesReport');
  }
  
  ngOnInit() { }
  
}
