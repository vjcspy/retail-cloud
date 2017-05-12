import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ReportState} from "../../../R/index";
import {SalesReportActions} from "../../../R/sales-report/sales-report.action";

@Component({
             selector: 'report-sales-advanced',
             templateUrl: 'advanced.html'
           })
export class ReportSalesAdvancedPage implements OnInit {
  constructor(private store: Store<ReportState>, private salesReportActions: SalesReportActions) { }
  
  ngOnInit() {
    this.salesReportActions.routerNavigatedSaleReport({
                                                        headerState: 'Advanced Reports',
                                                        headerDescription: 'Best of the world'
                                                      });
  }
  
}
