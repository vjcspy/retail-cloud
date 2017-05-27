import {Address} from "./Address";
import * as _ from "lodash";
import {CustomerDB} from "../../../../database/xretail/db/customer";
export class Customer extends CustomerDB {
    private _defaultBillingAddress;
    private _defaultShippingAddress;

    getId(): number {
        return this.getData('id');
    }

    getCustomerTaxClassId(): number|string {
        return this.getData('tax_class_id');
    }

    getDefaultShippingAddress(): Address {
        if (typeof this._defaultShippingAddress == "undefined") {
            if (this.getData('address') == null) {
                return null;
            }
            if (!this.getData('default_shipping'))
                return null;
            this._defaultShippingAddress = _.find(this.getData('address'), (add: Address) => {
                return add['id'] == this.getData('default_shipping');
            });
            if (!this._defaultShippingAddress)
                this._defaultShippingAddress = null;
            else {
                let add                      = new Address();
                this._defaultShippingAddress = Object.assign(add, this._defaultBillingAddress);
            }
        }
        return this._defaultShippingAddress;
    }

    getDefaultBillingAddress(): Address {
        if (typeof this._defaultBillingAddress == "undefined") {
            if (this.getData('address') == null) {
                return null;
            }
            if (!this.getData('default_billing'))
                return null;
            this._defaultBillingAddress = _.find(this.getData('address'), (add: Address) => {
                return add['id'] == this.getData('default_billing');
            });
            if (!this._defaultBillingAddress)
                this._defaultBillingAddress = null;
            else {
                let add                     = new Address();
                this._defaultBillingAddress = Object.assign(add, this._defaultBillingAddress);
            }
        }
        return this._defaultBillingAddress;
    }
}