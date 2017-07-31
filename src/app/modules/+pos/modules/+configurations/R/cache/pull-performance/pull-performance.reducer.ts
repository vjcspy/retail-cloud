import {Action, ActionReducer} from "@ngrx/store";
import * as _ from 'lodash';
import * as moment from 'moment';
import {PullPerformanceActions} from "./pull-performance.actions";
import {ConfigurationsCacheStateRecord} from "../cache.state";
import {List} from "immutable";
import {pullPerformanceStateFactory} from "./pull-performance.state";

export const pullPerformanceReducer: ActionReducer<ConfigurationsCacheStateRecord> = (state: ConfigurationsCacheStateRecord, action: Action) => {
  switch (action.type) {
    
    case PullPerformanceActions.ACTION_START_PULL:
      return state.update('pullPerformance', () => {
        return pullPerformanceStateFactory()
          .set('isPulling', true)
          .set('pageSize', action.payload['pageSize'])
          .set('storeId', action.payload['storeId'])
          .set('entity', action.payload['entity']);
      });
    
    case PullPerformanceActions.ACTION_PULL_NEXT_PAGE:
      let nextPage = _.isNumber(state.pullPerformance.currentPage) ? (state.pullPerformance.currentPage + 1) : 1;
      return state.update('pullPerformance', (pullPerformance) => {
        return pullPerformance.update('performanceData', (list: List<any>) => {
          return list.push({startTime: moment(), page: nextPage});
        });
      });
    
    case PullPerformanceActions.ACTION_PULL_PAGE_SUCCESS:
      let pagePullSuccess = _.isNumber(state.pullPerformance.currentPage) ? (state.pullPerformance.currentPage + 1) : 1;
      return state.update('pullPerformance', (pullPerformance) => {
        return pullPerformance
          .set('currentPage', pagePullSuccess)
          .set('isPullFromCache', action.payload['data']['is_load_from_cache'])
          .update('performanceData', (list: List<any>) => {
            let index = list.findIndex((_d) => parseInt(_d['page']) === parseInt(action.payload['page']));
            return list.update(index, (_p) => Object.assign({}, {..._p}, {endTime: moment(), entities: _.size(action.payload['data']['items'])}));
          });
      });
    
    case PullPerformanceActions.ACTION_CANCEL_PULL:
    case PullPerformanceActions.ACTION_PULL_FAILED:
      return state.update('pullPerformance', (_d) => _d.set('isPulling', false)
                                                       .set('isComplete', false));
    
    case PullPerformanceActions.ACTION_PULL_SUCCESS:
      return state.update('pullPerformance', (_d) => _d.set('isPulling', false)
                                                       .set('isComplete', true));
    
    default:
      return state;
  }
};
