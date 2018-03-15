import {Event} from "../../../framework/General/Event/Event";
import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import {Giftcard} from "../Model/Product/Type/Giftcard";
import * as _ from 'lodash';
import {RetailDataHelper} from "../../../../services/retail-data-helper";

export class AddGiftcardType extends Event {
  create(): ObserverInterface {
    return new AddGiftcardTypeObserver();
  }
}

class AddGiftcardTypeObserver implements ObserverInterface {
  execute(observe: any): void {
    let {productType, factory} = observe;
    if (_.indexOf(RetailDataHelper.GIFT_CARD_TYPE_ID ,productType) > -1) {
      factory[productType] = new Giftcard();
    }
  }
}
