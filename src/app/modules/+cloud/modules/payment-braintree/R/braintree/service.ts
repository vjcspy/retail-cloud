import {Injectable} from '@angular/core';
import {Braintree} from "../../services/payments/braintree";

@Injectable()
export class BraintreeService {
  
  constructor(protected braintree: Braintree) { }
  
  getBraintree(): Braintree {
    return this.braintree;
  }
}
