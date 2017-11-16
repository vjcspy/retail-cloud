import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class PricingService {
  
  constructor() { }
  
  savePricing(pricing): Promise<any> {
    return new Promise((res, rej) => {
      MeteorObservable.call('pricing.create_pricing', {pricing})
                      .subscribe((_res) => {
                        res();
                      }, (_e) => {
                        rej();
                      });
    });
  }
  
  getBillingCylceSelectOptions() {
    return new Promise(((resolve, reject) => {
      MeteorObservable.call('data-provider.billing_cycle_select_options')
                      .subscribe((data) => resolve(data),
                                 (err) => reject(err));
    }));
  }
}
