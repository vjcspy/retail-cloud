import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosEntitiesActions} from "../entities.actions";
import {PosEntitiesState} from "../entities.state";
import {Observable} from "rxjs";
import {RealtimeService} from "./realtime.service";
import {RealtimeActions} from "./realtime.actions";
import {List} from "immutable";
import {Entity} from "../entities.model";
import {RootActions} from "../../../../../R/root.actions";

@Injectable()
export class RealtimeEffects {
  
  protected subscribedEntity = {};
  
  constructor(private actions$: Actions,
              private store$: Store<any>,
              private realtimeService: RealtimeService,
              private realtimeActions: RealtimeActions,
              private rootActions: RootActions) { }
  
  @Effect() subscribeRealtimeChange = this.actions$
                                          .ofType(
                                            PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                          )
                                          .withLatestFrom(this.store$.select('general'))
                                          .withLatestFrom(this.store$.select('entities'),
                                                          ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                          .filter((z) => {
                                            const action: Action = <any>z[0];
                                            return this.subscribedEntity[action.payload['entityCode']] !== true;
                                          })
                                          .filter((z) => {
                                            const entitiesState: PosEntitiesState = z[2];
                                            const action: Action                  = <any>z[0];
                                            return entitiesState[action.payload['entityCode']].needRealTime === true;
                                          })
                                          .map((z) => {
                                            const action: Action                                = <any>z[0];
                                            this.subscribedEntity[action.payload['entityCode']] = true;
                                            return z;
                                          })
                                          .flatMap(([action, generalState, entitiesState]) => {
                                            const entityCode = (action as Action).payload['entityCode'];
                                            const entity     = entitiesState[entityCode];
    
                                            return this.realtimeService
                                                       .realtimeEntityObservable(entityCode, <any>generalState)
                                                       .flatMap((realtimeData) => {
                                                         const {needRemove, needUpdate, entityInfo, newCacheTime} = realtimeData;
                                                         return Observable.from([
                                                                                  this.realtimeActions.realtimeNeedRemove({
                                                                                                                            needRemove,
                                                                                                                            entityInfo,
                                                                                                                            entity,
                                                                                                                            newCacheTime
                                                                                                                          }, false),
                                                                                  this.realtimeActions.realtimeNeedUpdate({
                                                                                                                            needUpdate,
                                                                                                                            entityInfo,
                                                                                                                            entity,
                                                                                                                            newCacheTime
                                                                                                                          }, false)
                                                                                ]);
                                                       })
                                                       .filter((_action: Action) => !_action.payload['realtimeData']['needRemove'] || (_action.payload['realtimeData']['needRemove'] as List<any>).count() > 0)
                                                       .filter((_action: Action) => !_action.payload['realtimeData']['needUpdate'] || (_action.payload['realtimeData']['needUpdate'] as List<any>).count() > 0);
                                          });
  
  @Effect() handleNeedRemove = this.actions$
                                   .ofType(
                                     RealtimeActions.ACTION_REALTIME_NEED_REMOVE
                                   )
                                   .flatMap((action: Action) => {
                                     const entity: Entity        = action.payload['realtimeData']['entity'];
                                     const needRemove: List<any> = action.payload['needRemove'];
                                     return Observable.fromPromise(this.realtimeService.handleDBNeedRemoveEntity(entity.entityCode, needRemove))
                                                      .flatMap(() => {
                                                        return Observable.fromPromise(this.realtimeService.updateEntityInfo(action.payload['entityInfo'], action.payload['realtimeData']['newCacheTime']));
                                                      })
                                                      .map(() => this.realtimeActions.realtimeRemovedEntityDB(entity.entityCode, needRemove, false));
                                   });
  
  @Effect() handleNeedUpdate = this.actions$
                                   .ofType(
                                     RealtimeActions.ACTION_REALTIME_NEED_UPDATE
                                   )
                                   .withLatestFrom(this.store$.select('general'))
                                   .flatMap((z) => {
                                     const action: Action        = z[0];
                                     const entity: Entity        = action.payload['realtimeData']['entity'];
                                     const needUpdate: List<any> = action.payload['realtimeData']['needUpdate'];
                                     return this.realtimeService
                                                .createRequestPullUpdateEntity(entity, needUpdate, action.payload['realtimeData']['newCacheTime'], <any>z[1])
                                                .flatMap((itemsData) => {
                                                  return Observable.fromPromise(this.realtimeService.handleDBUpdateEntity(entity, needUpdate, itemsData))
                                                                   .flatMap(() => {
                                                                     return Observable.fromPromise(this.realtimeService
                                                                                                       .updateEntityInfo(action.payload['realtimeData']['entityInfo'], action.payload['realtimeData']['newCacheTime']))
                                                                                      .map(() => this.realtimeActions
                                                                                                     .realtimeUpdatedEntityDB(entity.entityCode, needUpdate, itemsData, false));
                                                                   });
                                                })
                                                .catch(() => Observable.of(this.rootActions.error('realtime_failed', null, false)));
                                   });
}
