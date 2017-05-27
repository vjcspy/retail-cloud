import {EventContainer} from "../../framework/General/Event/EventContainer";
import {AddDiscountToCollector} from "./Observer/AddDiscountToCollector";
import {ProviderInterface} from "../../framework/General/ProviderInterface";
import {AddHiddenTaxes} from "./Observer/AddHiddenTaxes";
export class RegisterDiscount implements ProviderInterface {
    boot() {
        this.registerObserver();
    }

    registerObserver(): void {
        EventContainer.addEventHandle("init_checkout_collector", new AddDiscountToCollector());
        EventContainer.addEventHandle("process_hidden_taxes", new AddHiddenTaxes());
    }
}