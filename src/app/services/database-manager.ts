import {Injectable} from "@angular/core";
import {db, RetailDB} from "../modules/+pos/database/xretail/db/retail-db";

@Injectable()
export class DatabaseManager {
  private _dBInstance: RetailDB = db;
  static _countInstance: number = 0;
  
  constructor() {
    ++DatabaseManager._countInstance;
    if (DatabaseManager._countInstance > 1) {
      console.log('%c Error!!! Already more than one object initialization ', 'color: red');
    }
  }
  
  getDbInstance(): RetailDB {
    return this._dBInstance;
  }
  
  async deleteDb() {
    await this.getDbInstance().delete();
    await this.getDbInstance().open();
  }
  
}
