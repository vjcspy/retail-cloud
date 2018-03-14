import {Injectable} from '@angular/core';
import * as _ from "lodash";

@Injectable()
export class RetailDataHelper {

  // gift card type_id in 3rd extension
  static GIFT_CARD_TYPE_ID = ['aw_giftcard'];

  isPaymentCanUse(p) {
    return _.indexOf(['gift_card', 'reward_point', 'pay_pal'], p['type']) < 0;
  }
}
