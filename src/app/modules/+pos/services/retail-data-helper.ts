import {Injectable} from '@angular/core';
import * as _ from "lodash";

@Injectable()
export class RetailDataHelper {

  isPaymentCanUse(p) {
    return _.indexOf(['gift_card', 'reward_point', 'pay_pal'], p['type']) < 0;
  }
}
