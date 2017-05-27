import {TierPrices} from "./product/tier-prices";
import {XOptions} from "./product/x-options";
import {StockItems} from "./product/stock-items";
import * as _ from "lodash";
import {db} from "./retail-db";
import {CustomizableOption} from "./product/customizable-option";
import {DataObject} from "../../../core/framework/General/DataObject";
export class ProductDB extends DataObject {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  tier_prices: any[];
  status: number;
  visibility: number;
  type_id: string;
  tax_class_id: number;
  x_options: any;
  customizable_options: any[];
  stock_items: any;
  special_price: number;
  special_from_date: string;
  special_to_date: string;
  origin_image: string;
  media_gallery: string[];

  static  getFields(): string {
    return "id,sku,name,attribute_set_id,price,tier_prices,status,visibility,type_id,tax_class_id,x_options,customizable_options,stock_items,special_price,special_from_date,special_to_date,origin_image,media_gallery";
  }

  static getCode(): string {
    return "products";
  }

  mapWithParent(entityData: any = null): any {
    _.forEach(
      ProductDB.getFields().split(","), (key) => {
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
      let productData = await db[ProductDB.getCode()].where("id").equals(id + "").first();
      return this.mapWithParent(productData);
    }
    return false;
  }
}
