import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {ReportState} from "../index";

@Injectable()
export class SalesReportActions {
  static ROUTER_NAVIGATED_ADVANCED_REPORT = 'ROUTER_NAVIGATED_ADVANCED_REPORT';
  
  constructor(private store: Store<ReportState>) { }
  
  /*
   * action sau khi vào từng child report nằm trong sale report
   * */
  routerNavigatedSaleReport(data) {
    this.store.dispatch({type: SalesReportActions.ROUTER_NAVIGATED_ADVANCED_REPORT, payload: data});
  }
}
