import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import {Event} from "../../../framework/General/Event/Event";
import {Price} from "../Model/Product/Type/Giftcard/Price";
import * as _ from 'lodash';
import {RetailDataHelper} from "../../../../services/retail-data-helper";

export class AddGiftcardPrice extends Event {
  create(): ObserverInterface {
    return new AddGiftCardPriceObserver();
  }
}

class AddGiftCardPriceObserver implements ObserverInterface {
  execute(observe: any): void {
    let {productType, factory} = observe;
    if (_.indexOf(RetailDataHelper.GIFT_CARD_TYPE_ID ,productType) > -1) {
      factory[productType] = new Price();
    }
  }
}
