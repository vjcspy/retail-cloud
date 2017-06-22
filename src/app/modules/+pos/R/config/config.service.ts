import {Injectable} from '@angular/core';
import {PosGeneralState} from "../general/general.state";
import {DatabaseManager} from "../../../../services/database-manager";

@Injectable()
export class PosConfigService {
  
  constructor(private db: DatabaseManager) { }
  
  createNewOrderCount(generalState: PosGeneralState, count = null) {
    return new Promise((resolve, reject) => {
      if (count === null) {
        count = {
          id: generalState.user['id'] + "|" + generalState.outlet['id'] + "|" + generalState.register['id'],
          user_id: generalState.user['id'],
          outlet_id: generalState.outlet['id'],
          register_id: generalState.register['id'],
          order_count: 0
        };
      }
      
      const db = this.db.getDbInstance();
      
      db.userOrderCount.put(<any>count).then(() => {resolve(count)}).catch(() => reject())
    });
  }
  
}
