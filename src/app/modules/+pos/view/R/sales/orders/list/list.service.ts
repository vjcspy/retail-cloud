import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ListService {
  clientStatus = {
    "1": "Partially Paid - Shipped",
    "2": "Partially Paid - Not Shipped",
    "3": "Partially Paid",
    
    "4": "Partially Refund - Shipped",
    "5": "Partially Refund - Not Shipped",
    "6": "Partially Refund",
    
    "7": "Fully Refund",
    
    "8": "Exchange - Shipped",
    "9": "Exchange - Not Shipped",
    "10": "Exchange",
    
    "11": "Complete - Shipped",
    "12": "Complete - Not Shipped",
    "13": "Complete",
  };
  
  protected _data = {};
  
  constructor() { }
  
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
      
      _.forEach(this.clientStatus, (status, key) => {
        this._data['element_status']['data'].push({value: key, label: status});
      });
    }
    return this._data['element_status'];
  }
  
  getClientStatus(status) {
    return this.clientStatus[status];
  }
}
