import {Injectable} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ConstrainDataHelper {
  protected static billingCycleData = [
    {
      billingCycle: 1,
      name: "Monthly"
    },
    {
      billingCycle: 2,
      name: "Annually"
    },
  ];
  
  constructor() { }
  
  static getBillingCycleName(billingCycle): string {
    const cycle = _.find(ConstrainDataHelper.billingCycleData, (d) => d['billingCycle'] === billingCycle);
    
    return !!cycle ? cycle['name'] : "";
  }
  
  static getBillingCycleData() {
    return ConstrainDataHelper.billingCycleData;
  }
}
