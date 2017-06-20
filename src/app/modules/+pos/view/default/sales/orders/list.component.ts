import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {OrdersState} from "../../../R/sales/orders/order.state";
import {ListActions} from "../../../R/sales/orders/list/list.actions";
import {ListService} from "../../../R/sales/orders/list/list.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersListComponent implements OnInit, AfterViewInit {
  @Input() ordersState: OrdersState;
  
  @ViewChild('dateSelectFrom') dateSelectFrom: ElementRef;
  @ViewChild('dateSelectTo') dateSelectTo: ElementRef;
  
  constructor(public menuLeftActions: MenuLeftActions,
              public listActions: ListActions,
              public listService: ListService) { }
  
  ngOnInit() { }
  
  trackById(index, order) {
    return order['id'];
  }
  
  trackByTimeStamp(index, group) {
    return group['timestamp'];
  }
  
  ngAfterViewInit(): void {
    this.initDateRangePicker();
  }
  
  searchOrder(value) {
    if (value !== this.ordersState.list.searchString) {
      this.listActions.changeSearchData({searchString: value});
    }
  }
  
  protected initDateRangePicker() {
    if (this.dateSelectFrom)
      jQuery(this.dateSelectFrom.nativeElement)['daterangepicker']({
                                                                     "singleDatePicker": true,
                                                                     "timePicker": false,
                                                                     "autoUpdateInput": true,
                                                                     "opens": "center",
                                                                     "startDate": this.ordersState.list.searchDateFrom,
                                                                     locale: {
                                                                       format: 'dd, MMM Do YYYY'
                                                                     }
                                                                   }, (start, end, label) => {
        start.hour(0).minute(0).second(0);
        this.listActions.changeSearchData({searchDateFrom: start});
      });
    if (this.dateSelectTo)
      jQuery(this.dateSelectTo.nativeElement)['daterangepicker']({
                                                                   "singleDatePicker": true,
                                                                   "timePicker": false,
                                                                   "autoUpdateInput": true,
                                                                   "opens": "center",
                                                                   "startDate": this.ordersState.list.searchDateTo,
                                                                   locale: {
                                                                     format: 'dd, MMM Do YYYY'
                                                                   }
                                                                 }, (start, end, label) => {
        start.hour(23).minute(59).second(59);
        this.listActions.changeSearchData({searchDateTo: start});
      });
  }
}
