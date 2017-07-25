import {Injectable} from '@angular/core';
import {PosGeneralState} from "../../general/general.state";
import {ApiManager} from "../../../../../services/api-manager";
import {RequestService} from "../../../../../services/request";
import {CustomerDB} from "../../../database/xretail/db/customer";

@Injectable()
export class EntityCustomerService {
  
  constructor(private apiUrlManager: ApiManager, private request: RequestService) { }
  
  createSaveCustomerRequest(customer, generalState: PosGeneralState) {
    customer['store_id'] = generalState.store['id'];
    
    return this.request
               .makePost(this.apiUrlManager.get(CustomerDB.getCode(), generalState.baseUrl), customer);
  }
  
  createSaveAddressRequest(address, generalState: PosGeneralState) {
    return this.request
               .makePost(this.apiUrlManager.get('customer-address', generalState.baseUrl), address);
  }
}
