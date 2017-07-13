import {Injectable} from '@angular/core';
import {RequestService} from "../../../../../../services/request";
import {ApiManager} from "../../../../../../services/api-manager";
import {PosGeneralState} from "../../../../R/general/general.state";

@Injectable()
export class ConfigurationsPaymentService {
  constructor(private requestService: RequestService, private apiUrlManager: ApiManager) {}
  
  createSavePaymentRequest(payment_data: any, generalState: PosGeneralState) {
    return this.requestService
               .makePost(this.apiUrlManager.get('payment', generalState.baseUrl), {payment_data});
  }
}
