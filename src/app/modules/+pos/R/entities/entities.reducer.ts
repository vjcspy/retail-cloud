import {Action} from "@ngrx/store";
import {ProductDB} from "../../database/xretail/db/product";
import {CustomerDB} from "../../database/xretail/db/customer";
import {posEntitiesStateFactory, PosEntitiesStateRecord} from "./entities.state";

export const entitiesReducer = (state: PosEntitiesStateRecord = posEntitiesStateFactory({
                                                                                          products: {
                                                                                            entityCode: ProductDB.getCode(),
                                                                                            pageSize: 100,
                                                                                            items: [],
                                                                                            apiUrlCode: ProductDB.getCode(),
                                                                                            isLoading: false,
                                                                                            isLoadComplete: false
                                                                                          },
                                                                                          customers: {
                                                                                            entityCode: CustomerDB.getCode(),
                                                                                            pageSize: 100,
                                                                                            items: [],
                                                                                            apiUrlCode: CustomerDB.getCode(),
                                                                                            isLoading: false,
                                                                                            isLoadComplete: false
                                                                                          }
                                                                                        }), action: Action) => {
  switch (action.payload) {
    default:
      return state;
  }
};
