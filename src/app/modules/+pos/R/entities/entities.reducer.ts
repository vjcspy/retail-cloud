import {Entity} from "./entities.model";
import {Action} from "@ngrx/store";
import {ProductDB} from "../../database/xretail/db/product";
import {CustomerDB} from "../../database/xretail/db/customer";

export interface EntitiesState {
  storeId?: number;
  registerId?: number;
  warehouseId?: number;
  outletId?: number;
  
  products?: Entity;
  categories?: Entity;
  customers?: Entity;
  taxes?: Entity;
  orders?: Entity;
  payments?: Entity;
  warehouse?: Entity;
  countries?: Entity;
  outlets?: Entity;
  stores?: Entity;
}

export const entitiesReducer = (state: EntitiesState = {
                                  products: {entityCode: ProductDB.getCode(), pageSize: 100, items: [], apiUrlCode: ProductDB.getCode()},
                                  customers: {entityCode: CustomerDB.getCode(), pageSize: 100, items: [], apiUrlCode: CustomerDB.getCode()},
                                }, action: Action) => {
  switch (action.payload) {
    default:
      return state;
  }
};
