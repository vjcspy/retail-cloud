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
  
  getPaymentStatusElem() {
    if (!this._data.hasOwnProperty('payment_status')) {
      this._data['payment_status'] = {
        label: "",
        data: [
          {
            value: "",
            label: "All status",
          },
          {
            value: "1",
            label: "Partially Paid",
          },
          {
            value: "2",
            label: "Complete",
          },
          {
            value: "3",
            label: "Partially Refund",
          },
          {
            value: "4",
            label: "Fully Refund",
          },
          {
            value: "5",
            label: "Exchange",
          },
        ]
      };
    }
    return this._data['payment_status'];
  }
  
  getShipmentStatusElem() {
    if (!this._data.hasOwnProperty('shipment_status')) {
      this._data['shipment_status'] = {
        label: "",
        data: [
          {
            value: "",
            label: "All status",
          },
          {
            value: "1",
            label: "No Ship",
          },
          {
            value: "2",
            label: "Not Shipped",
          },
          {
            value: "3",
            label: "Shipped",
          }
        ]
      };
      
    }
    return this._data['shipment_status'];
  }
  
  getSyncStatusElem(isSearchOnline: boolean = false) {
    this._data['sync_status'] = {
      label: "",
      data: [
        {
          value: "",
          label: "All status",
        }
      ]
    };
    if (isSearchOnline === false) {
      this._data['sync_status'].data.push({
                                            value: "0",
                                            label: "Not Pushed",
                                          }, {
                                            value: "1",
                                            label: "Pushed",
                                          });
    }
    
    this._data['sync_status'].data.push({
                                          value: "3",
                                          label: "Error",
                                        });
    
    return this._data['sync_status'];
  }
  
  getClientStatus(status) {
    return Order.getOrderClientStatus(status);
  }
  
  isActiveOrdersPage() {
    return this.router.isActive('pos/default/sales/orders', false);
  }
}
