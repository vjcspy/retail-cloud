import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "./entities.actions";
import {Action, Store} from "@ngrx/store";
import {PosState} from "../index";
import {Observable} from "rxjs";
import {PosEntitiesService} from "./entities.service";
import {RootActions} from "../../../../R/root.actions";
import {GeneralMessage} from "../../services/general/message";
import {List} from "immutable";
import {Entity} from "./entities.model";
import {PosPullState} from "./pull.state";
import {ProductDB} from "../../database/xretail/db/product";
import {PosEntitiesState} from "./entities.state";
import {PosGeneralState} from "../general/general.state";
import {CustomerDB} from "../../database/xretail/db/customer";
import {SettingDB} from "../../database/xretail/db/setting";
import {ShiftDB} from "../../database/xretail/db/shift";
import * as _ from 'lodash';
import {OrderDB} from "../../database/xretail/db/order";

@Injectable()
export class PosEntitiesEffects {
  constructor(private action$: Actions,
              private store: Store<PosState>,
              private posEntityService: PosEntitiesService) {}
  
  @Effect() initEntityBeforeGetFromSV$ = this.action$
                                             .ofType(
                                               PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB,
                                               // Cứ mỗi khi realtime thì lại init lại
                                               PosEntitiesActions.ACTION_REALTIME_ENTITY_PULLED_AND_SAVED_DB
                                             )
                                             .withLatestFrom(this.store.select('general'))
                                             .withLatestFrom(this.store.select('entities'),
                                                             ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                             .flatMap(([action, generalState, entitiesState]) => {
                                               const entityCode = (entitiesState[action.payload['entityCode']] as Entity).entityCode;
                                               return Observable.fromPromise(this.posEntityService.getStateCurrentEntityDb(generalState, entitiesState[entityCode]))
                                                                .flatMap(() => Observable.fromPromise(this.posEntityService.getDataFromLocalDB([entityCode][Symbol.iterator]()))
                                                                                         .map((mes: GeneralMessage) => {
                                                                                           return {
                                                                                             type: PosEntitiesActions.ACTION_GET_ENTITY_DATA_FROM_DB,
                                                                                             payload: {data: mes.data[entityCode], entityCode}
                                                                                           };
                                                                                         }));
                                             });
  
  @Effect() pullEntityDataFromServer$ = this.action$
                                            .ofType(
                                              // Trigger từ actions
                                              PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER,
                                              // Repeat để pull page tiếp theo
                                              PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS,
                                              // Trường hợp nếu chưa init từ DB thì sẽ init sau đó init thành công thì quay lại load
                                              PosEntitiesActions.ACTION_GET_ENTITY_DATA_FROM_DB
                                            )
                                            .withLatestFrom(this.store.select('general'))
                                            .withLatestFrom(this.store.select('entities'),
                                                            ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                            .withLatestFrom(this.store.select('pull'), ([action, generalState, entitiesState], pullState) => {
                                              return [action, generalState, entitiesState, pullState];
                                            })
                                            // Chỉ được pull entity khi dùng pull chain
                                            .filter(([action, generalState, entitiesState, pullState]) => (pullState as PosPullState).isPullingChain === true)
                                            .flatMap(([action, generalState, entitiesState]) => {
                                              const entityCode     = action.payload['entityCode'];
                                              const entity: Entity = entitiesState[entityCode];
                                              // Kiểm tra xem là entity sắp pull đã được init từ DB ra chưa?
                                              if (entity.isLoadedFromDB !== true) {
                                                return Observable.of({
                                                                       type: PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB,
                                                                       payload: {entityCode}
                                                                     });
                                              } else {
                                                return Observable.fromPromise(this.posEntityService.getStateCurrentEntityDb(generalState, entitiesState[entityCode]))
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
                                                                         query: this.createQueryPull(entity, generalState)
                                                                       }
                                                                     };
                                                                 });
                                              }
                                            });
  
  @Effect() pullEntityNextPage$ = this.action$
                                      .ofType(
                                        PosEntitiesActions.ACTION_PULL_ENTITY_NEXT_PAGE,
                                        PosEntitiesActions.ACTION_PULL_CANCEL
                                      )
                                      .withLatestFrom(this.store.select('general'))
                                      .withLatestFrom(this.store.select('entities'),
                                                      ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                      .switchMap(([action, generalState, entitiesState]) => {
                                                   if (action.type === PosEntitiesActions.ACTION_PULL_CANCEL) {
                                                     return Observable.of({
                                                                            type: RootActions.ACTION_NOTHING,
                                                                            payload: {entityCode: action.payload.entityCode, mess: "Cancel Pull"}
                                                                          });
                                                   } else {
                                                     const entity: Entity = entitiesState[action.payload.entityCode];
                                                     if (entity.limitPage > 0 && entity.currentPage === entity.limitPage) {
                                                       return Observable.of({
                                                                              type: PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                                                              payload: {
                                                                                entityCode: action.payload.entityCode
                                                                              }
                                                                            });
                                                     } else {
                                                       return Observable.fromPromise(this.posEntityService.pullAndSaveDb(entity, generalState))
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
                                                                        .catch(() => Observable.of({
                                                                                                     type: PosEntitiesActions.ACTION_PULL_ENTITY_FAILED,
                                                                                                     payload: {
                                                                                                       entityCode: action.payload.entityCode
                                                                                                     }
                                                                                                   })
                                                                        );
                                                     }
                                                   }
                                                 }
                                      );
  
  @Effect() realTimeEntity = this.action$
                                 .ofType(
                                   // Trigger realtime subscriber sau khi entity được init từ DB
                                   PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB
                                 )
                                 .withLatestFrom(this.store.select('general'))
                                 .withLatestFrom(this.store.select('entities'),
                                                 ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                 .switchMap(([action, generalState, entitiesState]) => {
                                   return Observable.from(Array.from(<any> (entitiesState as List<any>).keys()))
                                                    .filter((entityCode: string) => entitiesState[entityCode]['needRealTime'] === true)
                                                    .flatMap((entityCode: string) => {
                                                      return Observable.fromPromise(this.posEntityService.subscribeRealtimeAndSaveToDB(entitiesState[entityCode], generalState))
                                                                       .map(() => ({
                                                                         type: PosEntitiesActions.ACTION_REALTIME_ENTITY_PULLED_AND_SAVED_DB,
                                                                         payload: {entityCode}
                                                                       }))
                                                                       .catch(() => Observable.of({
                                                                                                    type: PosEntitiesActions.ACTION_REALTIME_ENTITY_ERROR,
                                                                                                    payload: {
                                                                                                      entityCode: action.payload.entityCode
                                                                                                    }
                                                                                                  }));
                                                    });
                                 });
  
  @Effect() resolveProductFilteredBySetting = this.action$
                                                  .ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS, PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS)
                                                  .filter((action: Action) => action.payload['entityCode'] === ProductDB.getCode())
                                                  .debounceTime(500)
                                                  .withLatestFrom(this.store.select('entities'))
                                                  .flatMap((data) => {
                                                    const entities: PosEntitiesState = data[1];
                                                    return Observable.fromPromise(this.posEntityService.getProductFilteredBySetting(entities.products, entities.retailConfig, entities.settings))
                                                                     .map((mes: GeneralMessage) => {
                                                                       return {type: PosEntitiesActions.ACTION_FILTERED_PRODUCTS, payload: mes.data};
                                                                     });
                                                  });
  
  
  protected createQueryPull(entity: Entity, generalState: PosGeneralState) {
    let _query = '';
    _.forEach(entity.propertyFilter, (val, key) => {
      _query += `&searchCriteria[${key}]=${val}`;
    });
    _query += `&searchCriteria[pageSize]=${entity.pageSize}&searchCriteria[currentPage]=${entity.currentPage + 1}`;
    
    switch (entity.entityCode) {
      case ProductDB.getCode():
      case CustomerDB.getCode():
      case SettingDB.getCode():
      case ShiftDB.getCode():
      case OrderDB.getCode():
        _query += "&searchCriteria[storeId]=" + generalState.store['id']
                  + "&searchCriteria[outletId]=" + generalState.outlet['id']
                  + "&searchCriteria[registerId]=" + generalState.register['id'];
        break;
      default:
    }
    return _query;
  }
}
