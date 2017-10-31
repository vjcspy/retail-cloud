import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import {Event} from "../../../framework/General/Event/Event";
import {Price} from "../Model/Product/Type/Giftcard/Price";

export class AddGiftcardPrice extends Event {
  create(): ObserverInterface {
    return new AddGiftCardPriceObserver();
  }
}

class AddGiftCardPriceObserver implements ObserverInterface {
  execute(observe: any): void {
    let {productType, factory} = observe;
    if (productType === 'aw_giftcard') {
      factory[productType] = new Price();
    }
  }
}
