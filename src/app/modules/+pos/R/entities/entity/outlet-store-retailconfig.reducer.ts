import {ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";
import {GeneralEntityActions} from "./outlet-store-retailconfig.actions";
import {outletEntityFactory, retailConfigEntityFactory, storeEntityFactory} from "../entities.model";

export const generalEntityReducer: ActionReducer<PosEntitiesStateRecord> = (state: PosEntitiesStateRecord, action) => {
  switch (action.type) {
    case GeneralEntityActions.ACTION_CLEARED_GENERAL_DB:
      return state
        .set('outlet', outletEntityFactory())
        .set('stores', storeEntityFactory())
        .set('retailConfig', retailConfigEntityFactory());
    
    default:
      return state;
  }
};
