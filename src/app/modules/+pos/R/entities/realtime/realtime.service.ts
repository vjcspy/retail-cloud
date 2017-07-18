import {Injectable} from '@angular/core';
import {PosGeneralState} from "../../general/general.state";
import {PosEntitiesService} from "../entities.service";
import {Observable} from "rxjs";
import {List} from "immutable";
import * as _ from 'lodash';
import {RealtimeStorage} from "../../../../../services/meteor-collections/reailtime-storage";
import {Entity} from "../entities.model";
import {GeneralMessage} from "../../../services/general/message";
import {RetailDB} from "../../../database/xretail/db/retail-db";
import {DatabaseManager} from "../../../../../services/database-manager";
import {ApiManager} from "../../../../../services/api-manager";
import {RequestService} from "../../../../../services/request";
import {EntityInformation} from "../../../database/xretail/db/entity-information";
import {OrderDB} from "../../../database/xretail/db/order";

@Injectable()
export class RealtimeService {
  
  constructor(private entitiesService: PosEntitiesService,
              private realtimeStorage: RealtimeStorage,
              private databaseManager: DatabaseManager,
              private apiManager: ApiManager,
              private requestService: RequestService) { }
  
  realtimeEntityObservable(entityCode: string, generalState: PosGeneralState): Observable<any> {
    return this.realtimeStorage
               .getCollectionObservable()
               .debounceTime(1500)
               .flatMap((collection) => {
                 return Observable.fromPromise(this.entitiesService.getEntityDataInformation(entityCode))
                                  .map((entityInfo) => {
                                    const changes  = collection.collection.find({
                                                                                  cache_time: {$gt: parseInt(entityInfo['cache_time'] + "")},
                                                                                  "data.entity": entityCode,
                                                                                  base_url: {'$regex': generalState.baseUrl}
                                                                                }).fetch();
                                    let needRemove = List.of();
                                    let needUpdate = List.of();
        
                                    _.forEach(changes, (change) => {
                                      if (_.indexOf(['remove', 'removed', 'delete'], change['data']['type_change']) > -1) {
                                        needRemove = needRemove.push(change['data']['entity_id']);
                                      } else {
                                        needUpdate = needUpdate.push(change['data']['entity_id']);
                                      }
                                    });
        
                                    const lastChange = _.last(changes);
                                    let newCacheTime;
                                    if (lastChange) {
                                      newCacheTime = lastChange['cache_time'];
                                    }
        
                                    return {needRemove, needUpdate, entityInfo, newCacheTime};
                                  });
               });
  }
  
  handleDBNeedRemoveEntity(entityCode: string, needRemove: List<string>): Promise<GeneralMessage> {
    let db: RetailDB = this.databaseManager.getDbInstance();
    return new Promise(async (resolve, reject) => {
      if (needRemove.count() === 0) {
        resolve();
      }
      
      try {
        await db[entityCode].bulkDelete(needRemove.toArray());
        
        return resolve();
      } catch (e) {
        return reject({isError: true, e});
      }
    });
  }
  
  handleDBUpdateEntity(entity: Entity, needUpdate: List<string>, data: any): Promise<GeneralMessage> {
    let db: RetailDB = this.databaseManager.getDbInstance();
    
    return new Promise(async (resolve, reject) => {
      if (!data.hasOwnProperty("items")) {
        return resolve();
      }
      try {
        
        if (entity.entityCode === OrderDB.getCode()) {
          let retailIdNeedRemove = [];
          _.forEach(data['items'], (item) => {
            retailIdNeedRemove.push(item['retail_id']);
          });
          await db[entity.entityCode].where('retail_id')
                                     .anyOf(retailIdNeedRemove)
                                     .delete();
          
          await db[entity.entityCode].bulkPut(data['items']);
        } else {
          
          await db[entity.entityCode].where(entity.entityPrimaryKey)
                                     .anyOf(_.split(_.union(needUpdate.toArray()).join(","), ","))
                                     .delete();
          
          await db[entity.entityCode].bulkPut(data['items']);
          
        }
        return resolve();
      } catch (e) {
        return reject({isError: true, e});
      }
    });
  }
  
  createRequestPullUpdateEntity(entity: Entity, needUpdate: List<string>, newCacheTime, generalState: PosGeneralState): Observable<any> {
    let url = this.apiManager.get(entity.entityCode, generalState.baseUrl);
    url += url.indexOf("?") > -1 ? "&" : "?" + entity.query
                                         + "&searchCriteria[entity_id]=" + _.union(needUpdate.toArray()).join(",")
                                         + "&searchCriteria[currentPage]=1"
                                         + "&searchCriteria[pageSize]=500"
                                         + "&searchCriteria[cache_time]=" + newCacheTime
                                         + "&searchCriteria[realTime]=1";
    
    if (generalState.store && !!generalState.store['id']) {
      url += "&searchCriteria[storeId]=" + generalState.store['id'];
    }
    
    return this.requestService
               .makeGet(url);
  }
  
  updateEntityInfo(entityInfo: EntityInformation, newCacheTime: number) {
    return new Promise(async (resolve, reject) => {
      if (isNaN(newCacheTime)) {
        return resolve();
      }
      try {
        entityInfo.cache_time = newCacheTime;
        await entityInfo.save();
        resolve();
      } catch (e) {
        reject();
      }
    });
  }
}
