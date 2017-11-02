import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {OrdersState} from "../../../R/sales/orders/order.state";
import {ListActions} from "../../../R/sales/orders/list/list.actions";
import {ListService} from "../../../R/sales/orders/list/list.service";
import {OfflineService} from "../../../../../share/provider/offline";
import {OrderService} from "../../../R/sales/orders/order.service";
import {PerfectScrollDirective} from "../../../../../share/directives/perfect-scroll";
import {PosConfigState} from "../../../../R/config/config.state";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {AuthenticateService} from "../../../../../../services/authenticate";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-list',
             templateUrl: 'list.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersListComponent implements AfterViewInit, OnChanges {
  configState$: Observable<PosConfigState>;
  
  @Input() ordersState: OrdersState;
  
  @ViewChild('dateSelectFrom') dateSelectFrom: ElementRef;
  @ViewChild('dateSelectTo') dateSelectTo: ElementRef;
  @ViewChild(PerfectScrollDirective) perfectScroll: PerfectScrollDirective;
  
  constructor(public menuLeftActions: MenuLeftActions,
              private authService: AuthenticateService,
              public listActions: ListActions,
              public listService: ListService,
              public offline: OfflineService,
              public orderService: OrderService,
              private store$: Store<any>) {
    this.configState$  = this.store$.select('config');
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('ordersState')) {
      this.perfectScroll.update();
    }
  }
  
  trackById(index, order) {
    return order['retail_id'];
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
  
  searchOrderStatus(value) {
    this.listActions.changeSearchData(value);
  }
  
  toggleSearchOnline($event) {
    if(this.authService.userCan('search_order')){
      this.listActions.changeSearchData({isSearchOnline: $event});
    }
  }
  
  protected initDateRangePicker() {
    if (this.dateSelectFrom) {
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
    }
    if (this.dateSelectTo) {
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
}
