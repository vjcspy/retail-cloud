import {Event} from "../../../framework/General/Event/Event";
import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import {Giftcard} from "../Model/Product/Type/Giftcard";

export class AddGiftcardType extends Event {
  create(): ObserverInterface {
    return new AddGiftcardTypeObserver();
  }
}

class AddGiftcardTypeObserver implements ObserverInterface {
  execute(observe: any): void {
    let {productType, factory} = observe;
    if (productType === 'aw_giftcard' || productType === 'aw_giftcard2') {
      factory[productType] = new Giftcard();
    }
  }
}
