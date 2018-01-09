import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OrdersState} from "../../../../R/sales/orders/order.state";
import {OrderService} from "../../../../R/sales/orders/order.service";
import {ListActions} from "../../../../R/sales/orders/list/list.actions";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {List} from "immutable";
import {Store as CoreStore} from "../../../../../core/framework/store/Model/Store";
import {StoreDB} from "../../../../../database/xretail/db/store";
import {PosGeneralState} from "../../../../../R/general/general.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-list-item',
             templateUrl: 'item.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersListItemComponent implements OnInit {
  @Input() order: Object;
  @Input() ordersState: OrdersState;
  @Input() configState: PosConfigState;
  @Input() storeState: PosEntitiesState;
  @Input() posGeneralState: PosGeneralState;
  
  store: CoreStore = null;
  
  constructor(public orderService: OrderService, public listActions: ListActions) { }
  
  ngOnInit() {
    let store_id: string = this.posGeneralState.store['id'];
    let store_order_id: string = this.order['store_id'];
  
    let store_id_filter = !!store_order_id ? store_order_id : store_id;
  
    let stores: List<StoreDB> = this.storeState.stores.items;
    let storeOrder = stores.find((o) => parseInt(o['id'] + '') === parseInt(store_id_filter + ''));
    let store = new CoreStore();
    this.store = store.mapWithParent(storeOrder);
  }
  
  isActive() {
    return this.order['retail_id'] && this.order['retail_id'] === this.ordersState.detail.order['retail_id'];
  }
  
  checkoutAsGuest(): boolean {
    if (this.order.hasOwnProperty('customer')) {
      return parseInt(this.order['customer']['id']) === parseInt(this.configState.setting.customer.getDefaultCustomerId());
    } else {
      return false;
    }
  }
}
