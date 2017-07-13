import {Injectable} from '@angular/core';
import {RequestService} from "../../../../../../services/request";
import {ApiManager} from "../../../../../../services/api-manager";
import {PosGeneralState} from "../../../../R/general/general.state";
import {List} from "immutable";

@Injectable()
export class ConfigurationsPaymentService {
  private _paymentSnapshot: List<any>;
  
  constructor(private requestService: RequestService, private apiUrlManager: ApiManager) {}
  
  createSavePaymentRequest(payment_data: any, generalState: PosGeneralState) {
    return this.requestService
               .makePost(this.apiUrlManager.get('payment', generalState.baseUrl), {payment_data});
  }
  
  get paymentSnapshot(): List<any> {
    return this._paymentSnapshot;
  }
  
  set paymentSnapshot(value: List<any>) {
    this._paymentSnapshot = value;
  }
}
