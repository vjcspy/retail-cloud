import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosEntitiesActions {
  static ACTION_INIT_ENTITY_FROM_LOCAL_DB    = 'ACTION_INIT_ENTITY_FROM_LOCAL_DB';
  static ACTION_GET_ENTITY_DATA_FROM_DB      = 'ACTION_GET_ENTITY_DATA_FROM_DB';
  static ACTION_PULL_ENTITY_DATA_FROM_SERVER = 'ACTION_GET_ENTITY_DATA_FROM_SERVER';
  static ACTION_PULL_CANCEL                  = 'ACTION_PULL_CANCEL';
  
  static ACTION_PULL_ENTITY_NEXT_PAGE    = 'ACTION_PULL_NEXT_PAGE';
  static ACTION_PULL_ENTITY_PAGE_SUCCESS = 'ACTION_PULL_PAGE_SUCCESS';
  static ACTION_PULL_ENTITY_FAILED       = 'ACTION_PULL_ENTITY_FAILED';
  static ACTION_PULL_ENTITY_SUCCESS      = 'ACTION_PULL_ENTITY_SUCCESS';
  
  static ACTION_ENTITY_DB_NOT_VALID = 'ACTION_ENTITY_DB_NOT_VALID';
  
  constructor(private store: Store<any>) {}
  
  initEntityFromLocalDB(entityCode: string): void {
    this.store.dispatch({type: PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB, payload: {entityCode}});
  }
  
  getEntityDataFromSv(entity: string): void {
    this.store.dispatch({type: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER, payload: entity});
  }
}
