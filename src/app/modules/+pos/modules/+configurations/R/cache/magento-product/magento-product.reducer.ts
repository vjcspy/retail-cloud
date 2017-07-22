import {ActionReducer} from "@ngrx/store";
import {ConfigurationsCacheStateRecord} from "../cache.state";
import {MagentoProductActions} from "./magento-product.actions";
import {List} from "immutable";

export const magentoProductReducer: ActionReducer<ConfigurationsCacheStateRecord> = (state, action) => {
  switch (action.type) {
    case MagentoProductActions.ACTION_PULLED_CACHE_INSTANCE:
      return state.setIn(['magentoProduct', 'pulledInstance'], true)
                  .setIn(['magentoProduct', 'instances'], List.of(...action.payload['instances']));
    
    case MagentoProductActions.ACTION_DELETE_INSTANCE:
      return state.setIn(['magentoProduct', 'syncing'], true);
    
    case MagentoProductActions.ACTION_DELETE_INSTANCE_FAILED:
      return state.setIn(['magentoProduct', 'syncing'], true);
    
    case MagentoProductActions.ACTION_DELETE_INSTANCE_SUCCESS:
      return state.setIn(['magentoProduct', 'syncing'], false)
                  .updateIn(['magentoProduct', 'instances'], (list: List<any>) => {
                    return list.filterNot((instance) => parseInt(instance['id']) === parseInt(action.payload['id']));
                  });
    
    default:
      return state;
  }
};
