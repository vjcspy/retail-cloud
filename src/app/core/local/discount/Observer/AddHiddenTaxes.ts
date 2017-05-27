import {Event} from "../../../framework/General/Event/Event";
import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import * as _ from "lodash";
import {DiscountPerItemBeforeTax} from "../Model/Quote/Address/Total/DiscountPerItemBeforeTax";
export class AddHiddenTaxes extends Event {
    create(): ObserverInterface {
        return new AddHiddenTaxesObserver();
    }

}

class AddHiddenTaxesObserver implements ObserverInterface {
    execute(observe: Object): void {
        if (!_.isEmpty(DiscountPerItemBeforeTax.HIDDEN_TAX)) {
            let hiddenTaxes         = observe['hidden_taxes'];
            hiddenTaxes             = hiddenTaxes.concat(DiscountPerItemBeforeTax.HIDDEN_TAX);
            observe['hidden_taxes'] = hiddenTaxes;
        }
    }
}