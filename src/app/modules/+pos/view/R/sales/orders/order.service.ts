import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {Order} from "../../../../core/framework/sales/Model/Order";

@Injectable()
export class OrderService {
  protected _data = {};
  
  constructor(private router: Router) { }
  
  getStatusElementData() {
    if (!this._data.hasOwnProperty('element_status')) {
      this._data['element_status'] = {
        label: "",
        data: [
          {
            value: "",
            label: "Choose an Status",
          }
        ]
      };
      
    }
    return this._data['element_status'];
  }
  
  getClientStatus(status) {
    return Order.getOrderClientStatus(status);
  }
  
  isActiveOrdersPage() {
    return this.router.isActive('pos/default/sales/orders', false);
  }
}
