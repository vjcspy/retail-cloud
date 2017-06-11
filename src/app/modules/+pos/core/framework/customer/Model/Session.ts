import {DataObject} from "../../General/DataObject";
import {Customer} from "./Customer";
import {ShareInstance} from "../../General/ObjectManager/ShareInstance";
import {GeneralException} from "../../General/Exception/GeneralException";
import {CustomerDB} from "../../../../database/xretail/db/customer";
export class Session extends DataObject implements ShareInstance {
    static CODE_INSTANCE = "CustomerSession";

    getCustomerId(): number {
        return this.getData('customer_id');
    }

    setCustomerGroupId(value: number): Session {
        return <any>this.setData('customer_group_id', value);
    }

    getCustomerGroupId(): number|string {
        return this.getCustomer().getCustomerGroupId();
    }

    getCustomer(): Customer {
        return this.getData('customer');
    }

    setCustomer(customer: Customer|Object): Session {
        if (customer instanceof Customer) {

        } else if (customer instanceof CustomerDB || customer instanceof Object) {
            let c    = new Customer();
            customer = c.mapWithParent(customer);
        } else {
            throw new GeneralException("Can't set customer");
        }
        this.setData('customer', customer);
        return this;
    }
    
    removeCustomer(){
      this.unsetData('customer');
    }
}
