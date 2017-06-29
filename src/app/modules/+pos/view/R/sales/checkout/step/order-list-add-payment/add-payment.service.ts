import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {ApiManager} from "../../../../../../../../services/api-manager";
import {RequestService} from "../../../../../../../../services/request";
import {PosGeneralState} from "../../../../../../R/general/general.state";
import {GeneralMessage} from "../../../../../../services/general/message";
import {DatabaseManager} from "../../../../../../../../services/database-manager";
import {Observable} from "rxjs";

@Injectable()
export class OrderListAddPaymentService {
  
  constructor(private apiUrlManager: ApiManager, private requestService: RequestService, private databaseManager: DatabaseManager) { }
  
  getTotalDue(order) {
    let paid = 0;
    _.forEach(order['payment'], p => {
      paid += parseFloat(p['amount']);
    });
    
    return parseFloat(order['totals']['grand_total']) - paid;
  }
  
  createAddPaymentRequest(data, generalState: PosGeneralState): Observable<any> {
    return this.requestService
               .makePost(this.apiUrlManager.get("take-payment", generalState.baseUrl), data);
  }
  
  /**
   *  Note: each entity in entitiesState đều có thể không có id bởi vì nó không phải hoàn toàn lấy từ cache ra, may be from realtime or push
   * direct to state....
   */
  updateOrderToDB(order, key: string): Promise<GeneralMessage> {
    let db = this.databaseManager.getDbInstance();
    
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) {
          await db.orders.bulkPut([order]);
        } else {
          await db.orders.where(key).equals(order[key]).modify(order);
        }
        
        return resolve();
      } catch (e) {
        console.log('err update order to db');
        return reject(e);
      }
    });
  }
  
}
