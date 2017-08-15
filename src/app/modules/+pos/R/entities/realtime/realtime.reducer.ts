import {Action, ActionReducer} from "@ngrx/store";
import {PosEntitiesStateRecord} from "../entities.state";
import {RealtimeActions} from "./realtime.actions";
import {Entity} from "../entities.model";
import {List} from "immutable";
import * as _ from 'lodash';
import {OrderDB} from "../../../database/xretail/db/order";
import {TaxDB} from "../../../database/xretail/db/tax";
import {SettingDB} from "../../../database/xretail/db/setting";

export const realtimeReducer: ActionReducer<PosEntitiesStateRecord> = (state: PosEntitiesStateRecord, action: Action) => {
  const type = action.type;
  if (type === RealtimeActions.ACTION_REALTIME_REMOVED_ENTITY_DB) {
    const entity: Entity           = state[action.payload['entityCode']];
    const needRemove: List<string> = action.payload['needRemove'];
    
    return state.updateIn([entity.entityCode, 'items'], (items: List<any>) => {
      return items.filter((item) => {
        return needRemove.indexOf(item[entity.entityPrimaryKey]) === -1;
      });
    });
  }
  
  if (type === RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB) {
    const entity: Entity           = state[action.payload['entityCode']];
    const needUpdate: List<string> = action.payload['needUpdate'];
    const itemsData                = action.payload['itemsData'];
    
    if (itemsData.hasOwnProperty('items') && _.isArray(itemsData['items'])) {
      return state.updateIn([entity.entityCode, 'items'], (items: List<any>) => {
        if (entity.entityCode === OrderDB.getCode()) {
          // Vì order không dùng id của magento để sync mà có thể tự tạo được ở client.
          _.forEach(itemsData['items'], (item: string) => {
            const orderIndex = items.findIndex((order: OrderDB) => {
              return order.retail_id === item['retail_id'] && (!order.order_id || order.order_id === item['order_id']);
            });
            if (orderIndex > -1) {
              items = items.update(orderIndex, (o: OrderDB) => {
                let newOrder = new OrderDB();
                return newOrder.addData(item);
              });
            } else {
              let newOrder = new OrderDB();
              newOrder.addData(item);
              items = items.push(newOrder);
            }
          });
        } else if (entity.entityCode === SettingDB.getCode()) {
          items = List.of();
          _.forEach(itemsData['items'], (item: string) => {
            let settingDB = new SettingDB();
            settingDB.addData(item);
            items = items.push(settingDB);
          });
        } else if (entity.entityCode === TaxDB.getCode()) {
          items = List.of();
          _.forEach(itemsData['items'], (item: string) => {
            let taxDb = new TaxDB();
            taxDb.addData(item);
            items = items.push(taxDb);
          });
        } else {
          items = <any>items.filter((item) => {
            return needUpdate.indexOf(item[entity.entityPrimaryKey]) === -1;
          });
          
          _.forEach(itemsData['items'], (item: string) => {
            let cloneFist = _.clone(items.first());
            
            if (cloneFist) {
              items = items.push(cloneFist.addData(item));
            }
          });
        }
        
        return items;
      });
    }
  }
  
  return state;
};
