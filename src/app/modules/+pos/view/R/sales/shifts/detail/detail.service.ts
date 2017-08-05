import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {List} from "immutable";
import {GeneralException} from "../../../../../core/framework/General/Exception/GeneralException";
import {RequestService} from "../../../../../../../services/request";
import {ApiManager} from "../../../../../../../services/api-manager";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {AuthenticateService} from "../../../../../../../services/authenticate";
import {Subject} from "rxjs";

@Injectable()
export class ShiftDetailService {
  protected printShiftReportSubject = new Subject();
  
  constructor(private requestService: RequestService,
              private api: ApiManager,
              private authenticate: AuthenticateService) { }
  
  getPrintReportObservable() {
    return this.printShiftReportSubject.asObservable().debounceTime(200).share();
  }
  
  printShiftReport() {
    this.printShiftReportSubject.next();
  }
  
  getTransactionAmounts(shift: any, payments: List<any>): Object {
    let paymentUsed: any = List.of();
    let totals           = {sales: 0, refund: 0, inOut: 0, counted: 0};
    
    const cashPayment = payments.find((p) => p['type'] === 'cash');
    if (cashPayment) {
      paymentUsed = paymentUsed.push({
                                       id: cashPayment['id'],
                                       type: cashPayment['type'],
                                       title: cashPayment['title'],
                                       sales: 0,
                                       refund: 0,
                                     });
    }
    
    // Sales, refund
    _.forEach(shift['transactions'], (payment: any) => {
      const paymentExistedIndex = paymentUsed.findIndex((p) => parseInt(p['id']) === parseInt(payment['payment_id']));
      if (paymentExistedIndex > -1) {
        let p = paymentUsed.get(paymentExistedIndex);
        if (parseInt(payment['is_purchase']) === 1) {
          p.sales += parseFloat(payment['amount']);
        } else {
          p.refund += parseFloat(payment['amount']);
        }
        paymentUsed = paymentUsed.set(paymentExistedIndex, p);
      } else {
        const paymentMethod = payments.find((p) => parseInt(p['id']) === parseInt(payment['payment_id']));
        if (paymentMethod) {
          let p = {
            id: paymentMethod['id'],
            type: paymentMethod['type'],
            title: paymentMethod['title'],
            sales: 0,
            refund: 0,
          };
          if (parseInt(payment['is_purchase']) === 1) {
            p.sales += parseFloat(payment['amount']);
          } else {
            p.refund += parseFloat(payment['amount']);
          }
          paymentUsed = paymentUsed.push(p);
        } else {
          // throw new GeneralException("Can't find payment method data in transaction");
        }
      }
      
    });
    
    // Totals
    
    totals.sales  = paymentUsed.reduce((result, p) => {
      return result + p.sales;
    }, 0);
    totals.refund = paymentUsed.reduce((result, p) => {
      return result + p.refund;
    }, 0);
    
    // Counted:
    if (shift.data && shift['data']['counted']) {
      totals.counted = _.sum(shift['data']['counted']);
    }
    
    totals.inOut = 0;
    _.forEach(shift['in_out'], (inOut) => {
      if (inOut['is_in'] == 1) {
        totals.inOut += parseFloat(inOut['amount']);
      } else {
        totals.inOut -= parseFloat(inOut['amount']);
      }
    });
    paymentUsed = paymentUsed.sortBy((p) => p['title']);
    return {totals, paymentUsed};
  }
  
  createCloseShiftRequest(shift, data, generalState: PosGeneralState) {
    return this.requestService.makePost(this.api.get('close-shift', generalState.baseUrl), {
      outlet_id: generalState.outlet['id'],
      register_id: generalState.register['id'],
      user_id: generalState.user['id'],
      user_name: this.authenticate.getUserName(),
      shift_id: shift['id'],
      data: data
    });
  }
  
  createOpenShiftRequest(data, generalState: PosGeneralState) {
    return this.requestService.makePost(this.api.get('open-shift', generalState.baseUrl), {
      outlet_id: generalState.outlet['id'],
      register_id: generalState.register['id'],
      user_id: generalState.user['id'],
      user_name: this.authenticate.getUserName(),
      amount: data['startMoney'],
      note: data['note']
    });
  }
  
  createAdjustShiftRequest(shift, data, generalState: PosGeneralState) {
    return this.requestService.makePost(this.api.get('adjust-shift', generalState.baseUrl), {
      shift_id: shift['id'],
      outlet_id: generalState.outlet['id'],
      register_id: generalState.register['id'],
      user_id: generalState.user['id'],
      user_name: this.authenticate.getUserName(),
      amount: data['amount'],
      note: data['note'],
      is_in: data['isIn']
    });
  }
}
