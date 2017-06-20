import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {PosGeneralState} from "../../../../../R/general/general.state";
import {RequestService} from "../../../../../../../services/request";
import {ApiManager} from "../../../../../../../services/api-manager";

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
  
  constructor(private requestService: RequestService, private apiUrl: ApiManager) { }
  
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
  
  createRequestSearchOrder(string: string, dateFrom: string, dateTo: string, generalState: PosGeneralState) {
    return this.requestService
               .makeGet(this.apiUrl.get('orders', generalState.baseUrl) +
                        "?searchCriteria[searchString]=" +
                        string +
                        "&searchCriteria[dateFrom]=" +
                        dateFrom +
                        "&searchCriteria[dateTo]=" +
                        dateTo +
                        "&searchCriteria[pageSize]=100" +
                        "&searchCriteria[outletId]=0");
  }
}
