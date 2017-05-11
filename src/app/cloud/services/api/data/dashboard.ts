import {Injectable} from '@angular/core';
import {APIManager} from "../api-manager";
import * as $q from 'q';
import {RequestManager} from "../request-manager";

@Injectable()
export class DashboardAPI {
  protected _data = {};
  
  constructor(protected apiManager: APIManager,
              protected request: RequestManager) { }
  
  requestWidgetDataDashboard(scope: string, period: string, start_date: string, end_date: string): Promise<any> {
    let defer = $q.defer();
    this.request
        .makeGet(this.apiManager.get("dashboard"), {}, {scope: scope, period: period, start_date: start_date, end_date: end_date})
        .subscribe(data => {
          return defer.resolve(data);
        });
    
    return <any>defer.promise;
  }
}
