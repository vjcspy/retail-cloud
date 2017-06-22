import {Injectable} from '@angular/core';
import {PosGeneralState} from "../../general/general.state";
import {ApiManager} from "../../../../../services/api-manager";
import {ProgressBarService} from "../../../../share/provider/progess-bar";
import {RequestService} from "../../../../../services/request";

@Injectable()
export class QuoteCustomerService {
  
  constructor(private apiManager: ApiManager, private progress: ProgressBarService, private request: RequestService) { }
  
  getCustomerOnline(customerId: string, generalState: PosGeneralState) {
    let _query = '';
    _query += `searchCriteria[currentPage]=1&searchCriteria[pageSize]=10&searchCriteria[storeId]=${generalState.store['id']}&searchCriteria[ids]=${customerId}`;
    let url    = this.apiManager.get("customers", generalState.baseUrl);
    url += url.indexOf('?') > -1 ? `&${_query}` : `?${_query}`;
    
    return this.request.makeGet(url);
  }
}
