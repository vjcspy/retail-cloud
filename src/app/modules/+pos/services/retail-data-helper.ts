import {Injectable} from '@angular/core';
import * as _ from "lodash";

@Injectable()
export class RetailDataHelper {

  // gift card type_id in 3rd extension
  static GIFT_CARD_TYPE_ID = ['aw_giftcard', 'aw_giftcard2'];

  isPaymentCanUse(p, forceForShiftReport: boolean = false) {
    let paymentsType = ['gift_card', 'reward_point', 'paypal', 'rounding_cash', 'izettle'];
    if (!!forceForShiftReport) {
      _.remove(paymentsType, (type) => {
        return type === 'rounding_cash';
      });
    }
    return _.indexOf(paymentsType, p['type']) < 0;
  }
}
