import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class CheckoutService {
  
  constructor() { }
  
  calculateToltal(plan, product_id): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call("sales.calculate_total", {plan, product_id})
                      .subscribe((res: any) => resolve(res), (e) => reject(e));
    });
  }
  
  submitOrder(plan, product_id): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('sales.order_submit', {plan, product_id})
                      .subscribe((planId) => resolve(planId), (err) => reject(err));
    });
  }
  
  getCheckoutData(checkoutData): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('sales.get_checkout_data', checkoutData)
                      .subscribe((data: any) => resolve(data), (err) => reject(err));
    });
  }
  
  checkPlanHasPaid(planId): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call("sales.plan_has_paid", {planId})
                      .subscribe((d) => resolve(d), (err) => reject(err));
    });
  }
}
