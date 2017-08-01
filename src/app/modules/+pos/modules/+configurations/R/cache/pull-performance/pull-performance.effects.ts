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
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {Router} from "@angular/router";
import {StoreDB} from "../../../../../database/xretail/db/store";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";

@Injectable()
export class PullPerformanceEffects {
  
  constructor(private http: Http,
              private actions$: Actions,
              private store$: Store<any>,
              private request: RequestService,
              private apiUrl: ApiManager,
              private pullPerformanceActions: PullPerformanceActions,
              private rootActions: RootActions,
              private router: Router,
              private notify: NotifyManager) { }
  
  @Effect() isLoadedEditFormDepend = this.actions$
                                         .ofType(
                                           PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                         )
                                         .filter(() => this.router.isActive('pos/configurations/default/advanced/pull-performance', false))
                                         .filter((action: Action) => {
                                           return !!action.payload['entityCode'] ?
                                             [
                                               StoreDB.getCode(),
                                             ]
                                               .indexOf(action.payload['entityCode']) > -1 : true;
                                         })
                                         .withLatestFrom(this.store$.select('entities'))
                                         .map((z) => {
                                           let isLoaded                          = false;
                                           const entitiesState: PosEntitiesState = <any>z[1];
    
                                           if (entitiesState.stores.isFinished === true) {
                                             isLoaded = true;
                                           }
    
                                           return this.pullPerformanceActions.loadedDependencyEntity(isLoaded, false);
                                         });
  
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
