import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosEntitiesActions {
  // Trigger lấy data từ Local DB
  static ACTION_INIT_ENTITY_FROM_LOCAL_DB = 'ACTION_INIT_ENTITY_FROM_LOCAL_DB';
  
  // Sau khi có data từ DB thì action này dùng để save dữ liệu vào state
  static ACTION_GET_ENTITY_DATA_FROM_DB = 'ACTION_GET_ENTITY_DATA_FROM_DB';
  
  // Start pull 1 entity từ server
  static ACTION_PULL_ENTITY_DATA_FROM_SERVER = 'ACTION_GET_ENTITY_DATA_FROM_SERVER';
  
  static ACTION_PULL_CANCEL = 'ACTION_PULL_CANCEL';
  
  static ACTION_PULL_ENTITY_NEXT_PAGE    = 'ACTION_PULL_NEXT_PAGE';
  static ACTION_PULL_ENTITY_PAGE_SUCCESS = 'ACTION_PULL_PAGE_SUCCESS';
  static ACTION_PULL_ENTITY_FAILED       = 'ACTION_PULL_ENTITY_FAILED';
  static ACTION_PULL_ENTITY_SUCCESS      = 'ACTION_PULL_ENTITY_SUCCESS';
  
  static ACTION_ENTITY_DB_NOT_VALID = 'ACTION_ENTITY_DB_NOT_VALID';
  
  constructor(private store: Store<any>) {}
  
  initEntityFromLocalDB(entityCode: string): void {
    this.store.dispatch({type: PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB, payload: {entityCode}});
  }
  
  // getEntityDataFromSv(entityCode: string): void {
  //   this.store.dispatch({type: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER, payload: {entityCode}});
  // }
}
