import {Injectable} from '@angular/core';
import {PosGeneralState} from "../../../../../R/general/general.state";
import {RequestService} from "../../../../../../../services/request";
import {ApiManager} from "../../../../../../../services/api-manager";
import {GeneralException} from "../../../../../core/framework/General/Exception/GeneralException";
import {Observable} from "rxjs";

@Injectable()
export class ShiftListService {
  
  constructor(private request: RequestService, private apiManager: ApiManager) { }
  
  createGetShiftRequest(currentPage: number, generalState: PosGeneralState): Observable<any> {
    if (!generalState.register || !generalState.outlet) {
      throw new GeneralException("Can't find outlet or register");
    }
    
    let _query = this.apiManager.get('shifts', generalState.baseUrl);
    _query += "?searchCriteria[outlet_id]=" + generalState.outlet['id'];
    _query += "&searchCriteria[register_id]=" + generalState.register['id'];
    _query += "&searchCriteria[pageSize]=15";
    _query += "&searchCriteria[currentPage]=" + (currentPage + 1);
    return this.request.makeGet(_query);
  }
}
