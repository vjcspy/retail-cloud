import {DataObject} from "../../General/DataObject";
export class Address extends DataObject {
  getCountryId(): number {
    return this.getData('country_id');
  }
  
  getPostcode(): string {
    return this.getData('postcode');
  }
  
  toJS() {
    return {
      city: this.getData('city') ? this.getData('city') : '',
      company: this.getData('company'),
      country_id: this.getData('country_id'),
      first_name: this.getData('first_name'),
      last_name: this.getData('last_name'),
      middlename: this.getData('middlename') ? this.getData('middlename') : '-',
      postcode: this.getData('postcode'),
      region: this.getData('region') ? this.getData('region') : '-',
      region_id: this.getData('region_id'),
      street: this.getData('street') ? this.getData('street') : '-',
      telephone: this.getData('telephone') ? this.getData('telephone') : '-',
    }
  }
}
