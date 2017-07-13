import {DataObject} from "../../../core/framework/General/DataObject";
import * as _ from 'lodash';

export class PaymentDB extends DataObject {
  id: number;
  type: string;
  title: string;
  payment_data: Object;
  is_active: string;
  is_dummy: string;
  allow_amount_tendered: string;
  
  static getFields(): string {
    return "id,type,title,payment_data,is_active,is_dummy,allow_amount_tendered";
  }
  
  static getCode(): string {
    return 'payment';
  }
  
  savPayments(payments: any[]) {
    return new Promise(async (resolve, reject) => {
      let size = _.size(payments);
      if (size > 0) {
        try {
          for (let i = 0; i < size; i++) {
            await this.save(payments[i]);
          }
        } catch (e) {
          return reject(e);
        }
        return resolve();
      } else {
        resolve();
      }
    });
  }
  
  save(payment: any = null) {
    return new Promise((resolve, reject) => {
      window['retailDB'].payment.put(payment === null ? this : payment).then((result) => {
        return resolve();
      }).catch((error) => {
        return reject(error);
      });
    });
  }
}
