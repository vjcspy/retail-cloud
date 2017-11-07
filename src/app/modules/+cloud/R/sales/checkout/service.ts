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
}
