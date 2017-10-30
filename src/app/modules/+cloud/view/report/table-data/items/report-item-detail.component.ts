import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SaleReportService} from "../../../../R/report/service";

@Component({
             selector: '[sale-report-item-detail]',
             templateUrl: 'report-item-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportItemDetailComponent {
  @Input('list_date') list_date       = [];
  @Input('data_filter') data_filter   = [];
  @Input('measures') measures         = [];
  @Input('item') item                 = [];
  @Input('colspanFooter') colspanFooter ;
  @Input('base_currency_code') base_currency_code;
  
  protected isDateRanger() {
    if (this.data_filter['dateTimeState'] == "compare" ){
      return false;
    }
    return true;
  }
  
  constructor(protected service: SaleReportService) {}
}
