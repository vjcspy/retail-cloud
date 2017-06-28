import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class OrderListAddPaymentService {
  
  constructor() { }
  
  getTotalDue(order) {
    let paid = 0;
    _.forEach(order['payment'], p => {
      paid += parseFloat(p['amount']);
    });
    
    return parseFloat(order['totals']['grand_total']) - paid;
  }
}
