import {Injectable} from '@angular/core';
import {DatabaseManager} from "../../../../services/database-manager";
import {RetailDB} from "../../database/xretail/db/retail-db";
import Dexie from 'dexie';
import {RequestService} from "../../../../services/request";
import {PosGeneralState} from "../general/general.state";
import {Entity} from "./entities.model";
import {ApiManager} from "../../../../services/api-manager";
import {EntityInformation} from "../../database/xretail/db/entity-information";
import * as _ from 'lodash';
import {GeneralMessage} from "../../services/general/message";
import {GeneralException} from "../../core/framework/General/Exception/GeneralException";
import {RealtimeStorage} from "../../../../services/meteor-collections/reailtime-storage";
import {ProductDB} from "../../database/xretail/db/product";

@Injectable()
export class PosEntitiesService {
  
  constructor(private databaseManager: DatabaseManager,
              private requestService: RequestService,
              private apiManager: ApiManager,
              protected realtimeStorage: RealtimeStorage) { }
  
  async getEntityDataInformation(entity: string): Dexie.Promise<EntityInformation> {
    let db = this.databaseManager.getDbInstance();
    
    return db['entityInformation'].where('id').equals(entity).first();
  }
  
  async getStateCurrentEntityDb(generalState: PosGeneralState, entity: Entity): Promise<GeneralMessage> {
    const entityCode = entity.entityCode;
    
    let entityDataInfo = await this.getEntityDataInformation(entity.entityCode);
    
    if (entity.isDependStore === true && parseInt(generalState.store['id']) < 1) {
      throw new GeneralException("Entity depend store, so we need select store before");
    }
    
    // if difference store id will flush
    if (entityDataInfo
        && (
          (entity.isDependStore === true && generalState.store['id'] !== entityDataInfo.storeId)
          || entity.pageSize !== entityDataInfo.pageSize || generalState.baseUrl !== entityDataInfo.base_url
        )
    ) {
      await this.whenNotValidDb(entityCode);
      entityDataInfo = null;
    }
    
    // never init before
    if (!entityDataInfo || !entityDataInfo.hasOwnProperty('id')) {
      // First time pull data so we init default value
      entityDataInfo             = new EntityInformation();
      entityDataInfo.id          = entityCode;
      entityDataInfo.currentPage = 0;
      entityDataInfo.isFinished  = false;
      entityDataInfo.pageSize    = entity.pageSize;
      entityDataInfo.storeId     = entity.isDependStore === true ? generalState.store['id'] : null;
      entityDataInfo.base_url    = generalState.baseUrl;
      await entityDataInfo.save(true);
    }
    
    return entityDataInfo.hasOwnProperty('id')
           && entityDataInfo.id === entityCode
           && entityDataInfo.isFinished === true
           && (entity.isDependStore !== true || entityDataInfo.storeId === generalState.store['id']) ?
      {data: {isFinished: true}} : {data: {isFinished: false, currentPage: entityDataInfo.currentPage}};
  }
  
  protected async whenNotValidDb(entity: string): Promise<any> {
    console.log("DB note valid: " + entity);
    let db: RetailDB = this.databaseManager.getDbInstance();
    await db[entity].clear();
    await db.entityInformation.where('id').equals(entity).delete();
  }
  
  async pullAndSaveDb(entity: Entity, generalState: PosGeneralState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      let url            = this.apiManager.get(entity.apiUrlCode, generalState.baseUrl);
      const nextPagePull = (entity.currentPage + 1);
      url +=
        url.indexOf("?") > -1 ?
          "&" : "?" + entity.query
                + "&searchCriteria[currentPage]=" + nextPagePull
                + "&searchCriteria[storeId]=" + generalState.store['id']
                + "&searchCriteria[outlet_id]=" + generalState.outlet['id']
                + "&searchCriteria[register_id]=" + generalState.register['id'];
      
      this.requestService
          .makeGet(url)
          .subscribe(
            async (data) => {
              let items: any = <any> data['items'];
          
              // Product Pull DataInfo
              let entityInfo: EntityInformation = await this.getEntityDataInformation(entity.entityCode);
          
              if (_.isEmpty(items)) {
                // finished
                entityInfo.isFinished = true;
                entityInfo.cache_time = data['cache_time'];
                await entityInfo.save();
            
                return resolve({error: false, data: {isFinished: true}});
              } else {
                // not yet finished
                let db: RetailDB = this.databaseManager.getDbInstance();
                try {
                  await db[entity.entityCode].bulkAdd(items);
                } catch (e) {
                  console.log("add entities to cache failed");
                }
            
                // save data pull success
                entityInfo.currentPage = nextPagePull;
                await entityInfo.save();
            
                return resolve({error: false, data: {isFinished: false, currentPage: nextPagePull, items}});
              }
            },
            (error) => {
              return reject(error);
            }
          );
    });
  }
  
  async getDataFromLocalDB(entitiesCode: Iterator<any>): Promise<GeneralMessage> {
    return new Promise(async (resolve, reject) => {
      let data         = {};
      let db: RetailDB = this.databaseManager.getDbInstance();
      
      let entityCode;
      entityCode = entitiesCode.next();
      while (entityCode.done === false) {
        let items                         = await db[entityCode['value']].toArray();
        let entityInfo: EntityInformation = await this.getEntityDataInformation(entityCode['value']);
        data[entityCode['value']]         = {items, ...entityInfo, entityCode: entityCode['value']};
        entityCode                        = entitiesCode.next();
      }
      
      return resolve({data});
    });
  }
  
  subscribeRealtimeAndSaveToDB(entity: Entity, generalState: PosGeneralState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
                         this.realtimeStorage
                             .getCollectionObservable()
                             .debounceTime(1500)
                             .filter(() => !!entity.entityCode)
                             .subscribe(async (collection) => {
                               const entityInfo = await this.getEntityDataInformation(entity.entityCode);
                               const changes    = collection.collection.find({
                                                                               cache_time: {$gt: parseInt(entityInfo['cache_time'] + "")},
                                                                               "data.entity": entity.entityCode,
                                                                               base_url: {'$regex': generalState.baseUrl}
                                                                             }).fetch();
                               if (_.size(changes) === 0) {
                                 return;
                               }
                               let db: RetailDB = this.databaseManager.getDbInstance();
                               let _needRemove  = [];
                               let _needUpdate  = [];
        
                               _.forEach(changes, (change) => {
                                 if (_.indexOf(['remove', 'removed', 'delete'], change['data']['type_change']) > -1) {
                                   _needRemove.push(change['data']['entity_id']);
                                 } else {
                                   _needUpdate.push(change['data']['entity_id']);
                                 }
                               });
        
                               if (_.size(_needRemove) > 0) {
                                 try {
                                   await db[entity.entityCode].bulkDelete(_needRemove);
                                 } catch (e) {
                                   return reject({isError: true, e});
                                 }
                               }
        
                               if (_.size(_needUpdate) > 0) {
                                 let url = this.apiManager.get(entity.entityCode, generalState.baseUrl);
                                 url += url.indexOf("?") > -1 ? "&" : "?" + entity.query
                                                                      + "&searchCriteria[entity_id]=" + _.union(_needUpdate).join(",")
                                                                      + "&searchCriteria[currentPage]=1"
                                                                      + "&searchCriteria[pageSize]=500"
                                                                      + "&searchCriteria[realTime]=1";
                                 this.requestService
                                     .makeGet(url)
                                     .subscribe(async (data) => {
                                                  await db[entity.entityCode].where(entity.entityPrimaryKey)
                                                                             .anyOf(_.split(_.union(_needUpdate).join(","), ","))
                                                                             .delete();
                                                  try {
                                                    if (data.hasOwnProperty("items")) {
                                                      await db[entity.entityCode].bulkPut(data['items']);
                                                    }
                                                  } catch (e) {
                                                    reject({isError: true, e});
                                                  }
            
                                                  const lastChange      = _.last(changes);
                                                  entityInfo.cache_time = lastChange['cache_time'];
                                                  await entityInfo.save();
            
                                                  return resolve({data: {isDonePullRealtime: true}});
                                                },
                                                (e) => reject({isError: true, e}));
                               } else if (_.size(_needRemove) > 0) {
                                 const lastChange      = _.last(changes);
                                 entityInfo.cache_time = lastChange['cache_time'];
                                 await entityInfo.save();
          
                                 return resolve({data: {isDonePullRealtime: true}});
                               }
                             });
                       }
    );
  }
  
  async getProductFilteredBySetting(productsEntity: Entity, retailConfigEntity: Entity, settingEntity: Entity): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      const products       = productsEntity.items;
      let productsFiltered: any;
      const retailConfig   = retailConfigEntity.items.find((v) => v['key'] === 'pos');
      const productSetting = settingEntity.items.find((v) => v['key'] === 'product');
      
      let visibility: any     = true;
      let type: any           = true;
      let sort: any           = true;
      let isSortAsc: any      = true;
      let showOutOfStock: any = true;
      let showDisabled: any   = true;
      
      if (retailConfig.hasOwnProperty('xretail/pos/show_product_by_visibility')) {
        visibility = retailConfig['xretail/pos/show_product_by_visibility'];
      }
      if (retailConfig.hasOwnProperty('xretail/pos/show_product_by_type')) {
        type = retailConfig['xretail/pos/show_product_by_type'];
      }
      if (retailConfig.hasOwnProperty('xretail/pos/sort_product_base_on')) {
        sort = retailConfig['xretail/pos/sort_product_base_on'];
      }
      if (retailConfig.hasOwnProperty('xretail/pos/sort_product_sorting')) {
        isSortAsc = retailConfig['xretail/pos/sort_product_sorting'];
      }
      if (retailConfig.hasOwnProperty('xretail/pos/show_outofstock_product')) {
        showOutOfStock = retailConfig['xretail/pos/show_outofstock_product'];
      }
      if (retailConfig.hasOwnProperty('xretail/pos/show_disable_product')) {
        showDisabled = retailConfig['xretail/pos/show_disable_product'];
      }
      productsFiltered = products.filter((product: ProductDB) => {
        if (product.getData('id') === productSetting['custom_sale_product_id']) {
          return false;
        }
        
        // load visibility
        if (visibility !== true) {
          if (_.indexOf(visibility, product.getData('visibility')) === -1) {
            return false;
          }
        }
        if (type !== true) {
          if (_.indexOf(type, product.getData('type_id')) === -1) {
            return false;
          }
        }
        // FiX XRT-187 : show out of stock product
        if (parseInt(showOutOfStock) !== 1) {
          if (product['stock_items']['is_in_stock'] === 0) {
            return false;
          }
        }
        // Fix XRT-185: filter disabled product
        if (parseInt(showDisabled) !== 1) {
          if (product.getData('status') === "2") {
            return false;
          }
        }
        return true;
      });
      
      if (sort !== true && isSortAsc !== true) {
        productsFiltered = productsFiltered.sortBy((product) => {
          if (sort === 'price' || sort === 'id') {
            return parseFloat(product.getData(sort));
          } else {
            // FIx 192 : get lower case to sort product by name , sku
            return _.toLower(product.getData(sort));
          }
        });
        if (isSortAsc !== 'asc') {
          //noinspection TypeScriptUnresolvedFunction
          productsFiltered = productsFiltered.reverse();
        }
      }
      
      return resolve({data: {productsFiltered}});
    });
  }
  
}