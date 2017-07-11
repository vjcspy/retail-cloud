import {Injectable} from '@angular/core';
import {RequestService} from "../../../../../../services/request";
import {ApiManager} from "../../../../../../services/api-manager";
import {RetailConfigDB} from "../../../../database/xretail/db/retail-config";
import {DatabaseManager} from "../../../../../../services/database-manager";
import {GeneralMessage} from "../../../../services/general/message";
import {RetailConfigActions} from "./retail-config.actions";

@Injectable()
export class RetailConfigService {
  private _retailConfigSnapshot: any;
  
  constructor(protected request: RequestService,
              protected apiUrl: ApiManager,
              protected databaseManager: DatabaseManager,
              protected retailConfigActions: RetailConfigActions) { }
  
  get retailConfigSnapshot(): any {
    return this._retailConfigSnapshot;
  }
  
  set retailConfigSnapshot(value: any) {
    this._retailConfigSnapshot = value;
  }
  
  createSaveRetailConfigRequest(group: string, data, generalState) {
    return this.request
               .makePost(this.apiUrl.get(RetailConfigDB.getCode(), generalState.baseUrl), {data, group});
  }
  
  saveRetailConfigToDB(config: any): Promise<GeneralMessage> {
    let db = this.databaseManager.getDbInstance();
    return new Promise(async (resolve, reject) => {
      try {
        this.retailConfigSnapshot[config['key']] = config['value'];
        await db.retailConfig.put(<any>config);
      } catch (e) {
        return reject({e, mess: 'save retail config error'});
      }
      
      return resolve();
    });
  }
  
  saveRetailConfig(group: string) {
    this.retailConfigActions.saveRetailConfig(group, this.retailConfigSnapshot[group]);
  }
}
