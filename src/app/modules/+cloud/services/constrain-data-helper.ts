import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ConstrainDataHelper {
  
  constructor() { }
  
  getBillingCycleName(billingCycle): string {
    const billingCycleData = [
      {
        billingCycle: 0,
        name: "Lifetime"
      },
      {
        billingCycle: 1,
        name: "Monthly"
      },
      {
        billingCycle: 2,
        name: "Annually"
      },
    ];
    
    const cycle = _.find(billingCycleData, (d) => d['billingCycle'] === billingCycle);
    
    return !!cycle ? cycle['name'] : "";
  }
}
