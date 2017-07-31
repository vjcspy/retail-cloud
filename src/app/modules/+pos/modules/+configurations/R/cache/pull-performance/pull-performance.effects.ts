import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Http, Response} from "@angular/http";
import {PullPerformanceActions} from "./pull-performance.actions";
import {Observable} from "rxjs";
import {PerformanceModuleState} from "../index";
import * as _ from 'lodash';
import {Action, Store} from "@ngrx/store";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {ConfigurationsState} from "../../index";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {PullPerformanceState} from "./pull-performance.state";
import {RequestService} from "../../../../../../../services/request";
import {ApiManager} from "../../../../../../../services/api-manager";
import {RootActions} from "../../../../../../../R/root.actions";

@Injectable()
export class PullPerformanceEffects {
  
  constructor(private http: Http,
              private actions$: Actions,
              private store$: Store<any>,
              private request: RequestService,
              private apiUrl: ApiManager,
              private rootActions: RootActions,
              private notify: NotifyManager) { }
  
  @Effect() startPull$ = this.actions$
                             .ofType(PullPerformanceActions.ACTION_START_PULL)
                             .switchMap(() => Observable.of({type: PullPerformanceActions.ACTION_PULL_NEXT_PAGE}));
  
  @Effect() triggerNextPage = this.actions$
                                  .ofType(PullPerformanceActions.ACTION_PULL_PAGE_SUCCESS)
                                  .withLatestFrom(this.store$.select('configurations'))
                                  .map((z: any) => {
                                    const action: Action = z[0];
                                    return action.payload['data'].hasOwnProperty('items') ?
                                      _.size(action.payload['data']['items']) > 0 ?
                                        {type: PullPerformanceActions.ACTION_PULL_NEXT_PAGE} :
                                        {type: PullPerformanceActions.ACTION_PULL_SUCCESS} :
                                      {type: PullPerformanceActions.ACTION_PULL_FAILED};
                                  });
  
  @Effect() pullPage$ = this.actions$
                            .ofType(
                              PullPerformanceActions.ACTION_PULL_NEXT_PAGE,
                              PullPerformanceActions.ACTION_CANCEL_PULL
                            )
                            .withLatestFrom(this.store$.select('configurations'))
                            .withLatestFrom(this.store$.select('general'), (z, z1) => [...z, z1])
                            .switchMap((z: any) => {
                                         const generalState: PosGeneralState              = z[2];
                                         const pullPerformanceState: PullPerformanceState = (z[1] as ConfigurationsState).cache.pullPerformance;
    
                                         if (pullPerformanceState.isPulling === false) {
                                           return Observable.of(this.rootActions.nothing("cancel_pull", false));
                                         }
    
                                         let url = this.apiUrl.get(pullPerformanceState.entity, generalState.baseUrl);
                                         url += (url.indexOf("?") > -1 ? "&" : "?")
                                                + `searchCriteria[storeId]=${pullPerformanceState.storeId}&searchCriteria[pageSize]=${pullPerformanceState.pageSize}&searchCriteria[currentPage]=${pullPerformanceState.currentPage + 1}`;
    
                                         return this.request.makeGet(url)
                                                    .map((data) => {
                                                      return {
                                                        type: PullPerformanceActions.ACTION_PULL_PAGE_SUCCESS,
                                                        payload: {
                                                          data,
                                                          page: pullPerformanceState.currentPage + 1
                                                        }
                                                      };
                                                    })
                                                    .catch((e) => Observable.of({
                                                                                  type: PullPerformanceActions.ACTION_PULL_FAILED,
                                                                                  payload: {error: e}
                                                                                }));
                                       }
                            );
}
