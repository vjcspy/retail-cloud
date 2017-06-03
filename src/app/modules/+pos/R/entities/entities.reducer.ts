import {Action} from "@ngrx/store";
import {posEntitiesStateFactory, PosEntitiesStateRecord} from "./entities.state";
import {PosEntitiesActions} from "./entities.actions";
import * as _ from 'lodash';
import {ProductDB} from "../../database/xretail/db/product";
import {CustomerDB} from "../../database/xretail/db/customer";
import {SettingDB} from "../../database/xretail/db/setting";
import {PosGeneralState} from "../general/general.state";
import {ShiftDB} from "../../database/xretail/db/shift";

export const entitiesReducer = (state: PosEntitiesStateRecord = posEntitiesStateFactory(), action: Action) => {
  switch (action.type) {
    
    case  PosEntitiesActions.ACTION_GET_ENTITY_DATA_FROM_DB:
      const data       = action.payload['data'];
      const entityCode = action.payload['entityCode'];
      let mergeData    = {};
      if (!!data['pageSize']) {
        mergeData['pageSize'] = data['pageSize'];
      }
      if (!!data['currentPage']) {
        mergeData['currentPage'] = data['currentPage'];
      }
      if (!!data['isFinished']) {
        mergeData['isFinished'] = data['isFinished'];
      }
      return state.updateIn([entityCode, 'items'], (list) => list.push(...data['items']))
                  .setIn([entityCode, 'isLoadedFromDB'], true)
                  .mergeIn([entityCode], mergeData);
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS:
      return state.updateIn([action.payload['entityCode'], 'currentPage'], (currentPage) => ++currentPage)
                  .updateIn([action.payload['entityCode'], 'items'],
                            (list) => list.push(..._.map(action.payload.items, (p) => (new ProductDB()).addData(p))));
    
    case PosEntitiesActions.ACTION_FILTERED_PRODUCTS:
      return state.setIn([ProductDB.getCode(), 'itemFiltered'], action.payload['productsFiltered']);
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_NEXT_PAGE:
      const generalState: PosGeneralState = action.payload['generalState'];
      let _query                          = '';
      const propertyFilter                = state[action.payload['entityCode']]['propertyFilter'];
      _.forEach(propertyFilter, (val, key) => {
        _query += `&searchCriteria[${key}]=${val}`;
      });
      _query += `&searchCriteria[pageSize]=${state[action.payload['entityCode']]['pageSize']}&searchCriteria[currentPage]=${state[action.payload['entityCode']]['currentPage'] + 1}`;
      
      switch (action.payload['entityCode']) {
        case ProductDB.getCode():
        case CustomerDB.getCode():
        case SettingDB.getCode():
        case ShiftDB.getCode():
          _query += "&searchCriteria[storeId]=" + generalState.store['id']
                    + "&searchCriteria[outlet_id]=" + generalState.outlet['id']
                    + "&searchCriteria[register_id]=" + generalState.register['id'];
          return state.setIn([action.payload['entityCode'], 'query'], _query);
        default:
          return state.setIn([action.payload['entityCode'], 'query'], _query);
      }
    
    default:
      return state;
  }
};
