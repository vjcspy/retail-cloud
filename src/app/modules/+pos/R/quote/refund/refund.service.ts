import {Injectable} from '@angular/core';
import {ApiManager} from "../../../../../services/api-manager";
import {PosGeneralState} from "../../general/general.state";
import {RequestService} from "../../../../../services/request";

@Injectable()
export class QuoteRefundService {
  
  constructor(private apiManager: ApiManager, private requestService: RequestService) { }
  
  createLoadCreditmemoRequest(data: any, generalState: PosGeneralState) {
    return this.requestService
               .makePost(this.apiManager.get("creditmemo", generalState.baseUrl), data);
  }
}
