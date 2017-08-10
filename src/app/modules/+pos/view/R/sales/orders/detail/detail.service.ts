import {Injectable} from '@angular/core';
import {RequestService} from "../../../../../../../services/request";
import {ApiManager} from "../../../../../../../services/api-manager";
import {PosGeneralState} from "../../../../../R/general/general.state";

@Injectable()
export class OrderDetailService {
  
  constructor(private request: RequestService,
              private apiManager: ApiManager) { }
  
  createShipRequest(order_id, generalState: PosGeneralState) {
    return this.request
               .makePost(this.apiManager.get('shipment', generalState.baseUrl), {order_id, store_id: generalState.store['id']})
  }
}
