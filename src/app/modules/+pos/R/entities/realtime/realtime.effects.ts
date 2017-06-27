import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosEntitiesActions} from "../entities.actions";
import {PosEntitiesState} from "../entities.state";
import {Observable} from "rxjs";
import {RealtimeService} from "./realtime.service";
import {RealtimeActions} from "./realtime.actions";

@Injectable()
export class RealtimeEffects {
  
  constructor(private actions$: Actions,
              private store$: Store<any>,
              private realtimeService: RealtimeService,
              private realtimeActions: RealtimeActions) { }
  
  @Effect() realTimeEntity = this.actions$
                                 .ofType(
                                   PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                 )
                                 .withLatestFrom(this.store$.select('general'))
                                 .withLatestFrom(this.store$.select('entities'),
                                                 ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                 .filter((z) => {
                                   const entitiesState: PosEntitiesState = z[2];
                                   const action: Action                  = z[0];
                                   return entitiesState[action.payload['entityCode']].needRealTime === true;
                                 })
                                 .flatMap(([action, generalState, entitiesState]) => {
                                   const entityCode = action.payload['entityCode'];
    
                                   return this.realtimeService
                                              .realtimeEntityObservable(entityCode, generalState)
                                              .flatMap((realtimeData) => {
                                                const {needRemove, needUpdate} = realtimeData;
                                                return Observable.fromPromise(this.realtimeService.handleDBNeedRemoveEntity(entityCode, realtimeData['needRemove']))
                                                                 .flatMap(() => {
                                                                   return this.realtimeService
                                                                              .createRequestPullUpdateEntity(entitiesState[entityCode], needUpdate, generalState)
                                                                              .flatMap((data) => {
                                                                                return Observable.fromPromise(this.realtimeService.handleDBUpdateEntity(entitiesState[entityCode], needUpdate, data))
                                                                              });
                                                                 });
                                              });
                                 });
}
