import {Injectable} from '@angular/core';
import {ApiManager} from "../../../../../../../services/api-manager";
import {RequestService} from "../../../../../../../services/request";
import {PosGeneralState} from "../../../../../R/general/general.state";

@Injectable()
export class MagentoProductService {
  
  constructor(private apiUrl: ApiManager,
              private requestService: RequestService) { }
  
  createPullCacheInstanceRequest(generalState: PosGeneralState) {
    let url = this.apiUrl.get('product-cache', generalState.baseUrl);
    url += url.indexOf('?') > -1 ? `&searchCriteria[currentPage]=1` : `?searchCriteria[currentPage]=1`;
    
    return this.requestService.makeGet(url);
  }
  
  createDeleteInstanceRequest(id: number, generalState: PosGeneralState) {
    let url = this.apiUrl.get('product-cache', generalState.baseUrl);
    url += url.indexOf('?') > -1 ? `&id=${id}` : `?id=${id}`;
    
    return this.requestService.makeDelete(url);
  }
}
