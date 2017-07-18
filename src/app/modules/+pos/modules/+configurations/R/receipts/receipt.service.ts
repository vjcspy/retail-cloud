import {Injectable} from '@angular/core';
import {ApiManager} from "../../../../../../services/api-manager";
import {RequestService} from "../../../../../../services/request";
import {PosGeneralState} from "../../../../R/general/general.state";
import {ReceiptDB} from "../../../../database/xretail/db/receipt";
import {Observable} from "rxjs/Observable";

@Injectable()
export class ConfigurationsReceiptService {
  
  constructor(private apiUrlManager: ApiManager,
              private requestService: RequestService) { }
  
  createRequestSaveReceipt(receipt: any, generalState: PosGeneralState): Observable<any> {
    return this.requestService
               .makePost(this.apiUrlManager.get(ReceiptDB.getCode(), generalState.baseUrl), receipt);
  }
}
