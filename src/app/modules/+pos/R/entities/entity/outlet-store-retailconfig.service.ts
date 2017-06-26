import {Injectable} from '@angular/core';
import {DatabaseManager} from "../../../../../services/database-manager";
import {GeneralMessage} from "../../../services/general/message";

@Injectable()
export class GeneralEntityService {
  
  constructor(private db: DatabaseManager) { }
  
  async clearGeneralEntityIndexedData(): Promise<GeneralMessage> {
    const db = this.db.getDbInstance();
    return new Promise(async (resolve) => {
      await db.outlet.clear();
      await db.entityInformation.where('id').equals('outlet').delete();
      
      await db.stores.clear();
      await db.entityInformation.where('id').equals('stores').delete();
      
      await db.retailConfig.clear();
      await db.entityInformation.where('id').equals('retailConfig').delete();
      
      return resolve();
    });
  }
  
}
