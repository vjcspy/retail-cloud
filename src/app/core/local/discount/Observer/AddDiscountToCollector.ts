import {Event} from "../../../framework/General/Event/Event";
import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import {DiscountPerItemBeforeTax} from "../Model/Quote/Address/Total/DiscountPerItemBeforeTax";
import {DiscountPerItemAfterTax} from "../Model/Quote/Address/Total/DiscountPerItemAfterTax";
export class AddDiscountToCollector extends Event {
    create(): ObserverInterface {
        return new AddDiscountToCollectorObserver();
    }
}

class AddDiscountToCollectorObserver implements ObserverInterface {
    execute(observe: Object): void {
        observe['collector'].push(new DiscountPerItemBeforeTax());
        observe['collector'].push(new DiscountPerItemAfterTax());
    }
}