import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

/*
* Implement base on interface, so we will change server end-point laterÏ.
* */
@Injectable()
export class BrainTreeMeteorServer {
  
  constructor() { }
  
  getClientToken() {
    return new Promise((res, rej) => {
      MeteorObservable.call('sales-payment-braintree.client_token')
                      .subscribe((_r) => {
                                   res(_r);
                                 },
                                 (_e) => {
                                   rej(_e);
                                 });
    });
  }
  
  getPlan() {
    return new Promise((res, rej) => {
      MeteorObservable.call('sales-payment.get_sale_payment')
                      .subscribe((plan) => {
                                   res(plan);
                                 },
                                 (_e) => {
                                   rej(_e);
                                 });
    });
  }
  
  pay(planId, gatewayAdditionData) {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('sales-payment.pay', {planId, gatewayAdditionData})
                      .subscribe((res) => resolve(res),
                                 (err) => reject(err));
    });
  }
}
