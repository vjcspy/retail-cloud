import {Injectable} from '@angular/core';
import {DatabaseManager} from "../../../../../../../services/database-manager";
import {GeneralMessage} from "../../../../../services/general/message";

@Injectable()
export class ConfigurationsClientDbService {
  
  constructor(private databaseManager: DatabaseManager) { }
  
  getEntitiesInfo(): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      const db = this.databaseManager.getDbInstance();
      db.entityInformation.toArray().then((entities) => {
        return resolve({data: {entities}});
      });
    });
  }
}
