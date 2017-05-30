import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "./entities.actions";
import {Store} from "@ngrx/store";
import {PosState} from "../index";
import {Observable} from "rxjs";
import {PosEntitiesService} from "./entities.service";
import {PosGeneralService} from "../general/general.service";
import {RootActions} from "../../../../R/root.actions";
import {GeneralMessage} from "../../services/general/message";

@Injectable()
export class PosEntitiesEffects {
  constructor(private action$: Actions,
              private store: Store<PosState>,
              private posEntityService: PosEntitiesService,
              private posGeneralService: PosGeneralService) {}
  
  /*
   * Sau khi app init thì bắt đầu lấy data từ trong cache ra.
   * Lưu ý KHÔNG phải entity nào cũng phụ thuộc vào store.
   */
  @Effect() initEntityFromLocalDB$ = this.action$
                                         .ofType(PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB)
                                         .withLatestFrom(this.store.select('general'))
                                         .withLatestFrom(this.store.select('entities'),
                                                         ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                         .switchMap(([action, generalState, entitiesState]) => {
                                           const entityCode = action.payload['entityCode'];
                                           return Observable.fromPromise(this.posEntityService.getStateCurrentEntityDb(action.payload['entityCode'], generalState, entitiesState[entityCode]))
                                                            .switchMap(() => Observable.fromPromise(this.posEntityService.getDataFromLocalDB([entityCode][Symbol.iterator]()))
                                                                                       .map((mes: GeneralMessage) => {
                                                                                         return {
                                                                                           type: PosEntitiesActions.ACTION_GET_ENTITY_DATA_FROM_DB,
                                                                                           payload: mes.data
                                                                                         };
                                                                                       }));
    
                                         });
  
  @Effect() pullEntityDataFromServer$ = this.action$
                                            .ofType(PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER,
                                                    PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS)
                                            .withLatestFrom(this.store.select('general'))
                                            .withLatestFrom(this.store.select('entities'),
                                                            ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                            .switchMap(([action, generalState, entitiesState]) => {
                                              const entityCode = action.payload['entityCode'];
                                              return Observable.fromPromise(this.posEntityService.getStateCurrentEntityDb(entityCode, generalState, entitiesState[entityCode]))
                                                               .map((entityState: GeneralMessage) => {
                                                                 return entityState.data['isFinished'] === true ?
                                                                   {
                                                                     type: PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                                                     payload: {
                                                                       entityCode: action.payload['entityCode']
                                                                     }
                                                                   } :
                                                                   {
                                                                     type: PosEntitiesActions.ACTION_PULL_ENTITY_NEXT_PAGE,
                                                                     payload: {
                                                                       entityCode: action.payload['entityCode'],
                                                                       // ensure currentPage always exactly
                                                                       currentPage: entityState.data['currentPage']
                                                                     }
                                                                   };
                                                               });
                                            });
  
  @Effect() pullEntityNextPage$ = this.action$
                                      .ofType(PosEntitiesActions.ACTION_PULL_ENTITY_NEXT_PAGE, PosEntitiesActions.ACTION_PULL_CANCEL)
                                      .withLatestFrom(this.store.select('general'))
                                      .withLatestFrom(this.store.select('entities'),
                                                      ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                      .switchMap(([action, generalState, entitiesState]) =>
                                                   action.type === PosEntitiesActions.ACTION_PULL_CANCEL ?
                                                     Observable.of({type: RootActions.ACTION_NOTHING}) :
                                                     Observable.fromPromise(this.posEntityService
                                                                                .pullAndSaveDb(entitiesState[action.payload.entityCode], generalState))
                                                               .map((pullData: GeneralMessage) => {
                                                                 if (pullData.data['isFinished'] === true) {
                                                                   return {
                                                                     type: PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                                                     payload: {
                                                                       entityCode: action.payload.entityCode
                                                                     }
                                                                   };
                                                                 } else {
                                                                   return {
                                                                     type: PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS, payload: {
                                                                       entityCode: action.payload.entityCode,
                                                                       items: pullData.data['items']
                                                                     }
                                                                   };
                                                                 }
                                                               })
                                      );
  
}
