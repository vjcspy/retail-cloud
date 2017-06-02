import {Action} from "@ngrx/store";
import {posEntitiesStateFactory, PosEntitiesStateRecord} from "./entities.state";
import {PosEntitiesActions} from "./entities.actions";
import * as _ from 'lodash';
import {ProductDB} from "../../database/xretail/db/product";

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
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER:
      switch (action.payload['entityCode']) {
        default:
          let _query           = '';
          const propertyFilter = state[action.payload['entityCode']]['propertyFilter'];
          _.forEach(propertyFilter, (val, key) => {
            _query += `&searchCriteria[${key}]=${val}`;
          });
          _query += `&searchCriteria[pageSize]=${state[action.payload['entityCode']]['pageSize']}`;
          return state.setIn([action.payload['entityCode'], 'query'], _query);
      }
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS:
      return state.updateIn([action.payload['entityCode'], 'currentPage'], (currentPage) => ++currentPage)
                  .updateIn([action.payload['entityCode'], 'items'],
                            (list) => list.push(..._.map(action.payload.items, (p) => (new ProductDB()).addData(p))));
    
    case PosEntitiesActions.ACTION_FILTERED_PRODUCTS:
      return state.setIn([ProductDB.getCode(), 'itemFiltered'], action.payload['productsFiltered']);
    
    default:
      return state;
  }
};
