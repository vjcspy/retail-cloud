import * as _ from "lodash";
import {db} from "./retail-db";
import {DataObject} from "../../../core/framework/General/DataObject";
export class CustomerDB extends DataObject {
  id: number;
  customer_group_id: number;
  default_billing: number;
  default_shipping: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: number;
  store_id: number;
  website_id: number;
  telephone: string;
  address: Object[]; // save another table

  static getFields(): string {
    return "id,customer_group_id,default_billing,default_shipping,email,first_name,last_name,gender,store_id,website_id,address,telephone";
  }

  static getCode(): string {
    return "customers";
  }

  mapWithParent(entityData: any = null): any {
    _.forEach(
      CustomerDB.getFields().split(","), (key) => {
        if (entityData != null) {
          if (key && entityData.hasOwnProperty(key)) {
            this.setData(key, entityData[key]);
          }
        } else {
          if (key && this.hasOwnProperty(key)) {
            this.setData(key, this[key]);
          }
        }
      });
    return this;
  }

  async getById(id: number | string): Promise<any> {
    if (id) {
      let productData = await db[CustomerDB.getCode()].where("id").equals(id + "").first();
      return this.mapWithParent(productData);
    }
    return false;
  }

  getCustomerGroupId(): number {
    return this.getData("customer_group_id");
  }
}
