import {ActionReducer} from "@ngrx/store";
import {configurationsCacheStateFactory, ConfigurationsCacheStateRecord} from "./cache.state";
import {mergeSliceReducers} from "../../../../../../R/index";
import {magentoProductReducer} from "./magento-product/magento-product.reducer";
import {configurationsClientDbReducer} from "./client-db/client-db.reducer";

const configurationsCacheMainReduer: ActionReducer<ConfigurationsCacheStateRecord> = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const configurationsCacheReducer = mergeSliceReducers(configurationsCacheStateFactory(), configurationsCacheMainReduer, magentoProductReducer, configurationsClientDbReducer);
