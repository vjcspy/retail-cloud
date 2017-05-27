import {DataObject} from "../../General/DataObject";
export class Address extends DataObject {
    getCountryId(): number {
        return this.getData('country_id');
    }

    getPostcode(): string {
        return this.getData('postcode');
    }
}