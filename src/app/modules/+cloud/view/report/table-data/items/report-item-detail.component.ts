import {Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit} from '@angular/core';
import {SaleReportService} from "../../../../R/report/service";
import {AbstractRxComponent} from "../../../../../share/core/AbstractRxComponent";

@Component({
             selector: '[sale-report-item-detail]',
             templateUrl: 'report-item-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportItemDetailComponent extends AbstractRxComponent implements OnInit {
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
  
  constructor(protected service: SaleReportService, protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this._subscription['update_view'] = this.service.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
  });
}

  protected checkIsNumberDecimals(value,measure){
    if(measure == 'Total Refunded'){
      return false;
    }
    if (value == null || value == 'N/A' || isNaN(value)|| typeof value == 'undefined' || value == '--' || typeof value == 'string')
      return false;
    else
      return true;
  }
  
  protected checkNullValue(value,measure) {
    if (value == null || value == 'N/A' || value == "NaN" || typeof value === 'undefined' || value == NaN)
      return false;
    if(measure == "Total Refunded"){
      return false;
    }
    return true;
  }
  
  checkShowSymbolCurrency(measureLabel, value){
    if ((measureLabel == "Margin" || measureLabel == "Cart Size" || measureLabel == "Cart Value" ||
        measureLabel == "Cart Value (Incl Tax)" || measureLabel == "Discount Percent" || measureLabel == "Refund Percent"|| measureLabel == "Customer Count" ||
        measureLabel == "First Sale" || measureLabel == "Item Sold" || measureLabel == "Last Sale"|| measureLabel == "Order Count" ||
        measureLabel == "Refund Count" || measureLabel == "Item Sold" || measureLabel == "Last Sale"|| measureLabel == "Order Count" ||  measureLabel == "Total Refunded") ||
        this.checkIsNumberDecimals(value , measureLabel) == false) {
      return false;
    } else
      return true;
  }
}
