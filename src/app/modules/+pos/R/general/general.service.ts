import {Injectable} from '@angular/core';
import {GeneralMessage} from "../../services/general/message";
import {DatabaseManager} from "../../../../services/database-manager";
import {AsyncHelper} from "../../../../code/AsyncHelper";
import {Entity} from "../entities/entities.model";
import {List} from "immutable";
import {AppStorage} from "../../../../services/storage";

@Injectable()
export class PosGeneralService {
  constructor(private databaseManager: DatabaseManager, protected storage: AppStorage) {}
  
  async saveGeneralDataToDB(generalData: Object): Promise<GeneralMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        let db = this.databaseManager.getDbInstance();
        await AsyncHelper.forEach(generalData, async (v, k) => {
          await db.retailConfig.put(<any>{key: k, value: v});
        });
        return resolve();
      } catch (e) {
        return reject({isError: true, e});
      }
    });
  }
  
  retrieveOutletRegister(retailConfig: Entity): Object {
    let retailConfigs: List<any> = retailConfig.items;
    const outlet                 = retailConfigs.find((v) => v['key'] === 'outlet' && !!v['value']['id']);
    const register               = retailConfigs.find((v) => v['key'] === 'register' && !!v['value']['id']);
    const store                  = retailConfigs.find((v) => v['key'] === 'store' && !!v['value']['id']);
    
    if (!!outlet && !!register && !!store) {
      return {outlet: outlet['value'], register: register['value'], store: store['value']};
    }
    else
      return null;
  }
  
  resolveGeneralDataFromStorage() {
    const outlet   = this.storage.localRetrieve('outlet');
    const register = this.storage.localRetrieve('register');
    const store    = this.storage.localRetrieve('store');
    const baseUrl  = this.storage.localRetrieve('baseUrl');
    
    if (!!outlet && !!register && !!store) {
      return {outlet, register, store, baseUrl};
    }
    else {
      return null;
    }
  }
}
