import {ProviderInterface} from "../../framework/General/ProviderInterface";
import {EventContainer} from "../../framework/General/Event/EventContainer";
import {AddGiftcardPrice} from "./Observer/add-giftcard-price";
import {AddGiftcardType} from "./Observer/add-giftcard-type";

export class RegisterAwGiftcard implements ProviderInterface {
  boot() {
    this.registerObserver();
  }
  
  registerObserver(): void {
    EventContainer.addEventHandle("price_factory", new AddGiftcardPrice());
    EventContainer.addEventHandle("product_type_factory", new AddGiftcardType());
  }
}
