import {Injectable} from '@angular/core';
import {PosGeneralState} from "../../general/general.state";
import {ApiManager} from "../../../../../services/api-manager";
import {RequestService} from "../../../../../services/request";
import {CustomerDB} from "../../../database/xretail/db/customer";

@Injectable()
export class EntityCustomerService {
  
  constructor(private apiUrlManager: ApiManager, private request: RequestService) { }
  
  createSaveCustomerAddressRequest(customer, address, addressType = 'billing', generalState: PosGeneralState) {
    return this.request
               .makePost(this.apiUrlManager.get(CustomerDB.getCode(), generalState.baseUrl), {
                 customer,
                 address,
                 addressType,
                 storeId: generalState.store['id']
               });
  }
}
