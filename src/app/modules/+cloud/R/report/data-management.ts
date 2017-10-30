import {Injectable} from '@angular/core';
import * as $q from "q";
import * as _ from "lodash";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";
import {OfflineService} from "../../../share/provider/offline";

@Injectable()
export class SaleReportDataManagement {
  saleReport: any;
  
  constructor(protected requestService: RequestService,
              protected apiUrlManager: ApiManager,
              protected onlineOfflineService: OfflineService) {;
  }
  
  
  
}
