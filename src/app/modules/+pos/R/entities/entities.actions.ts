import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PosEntitiesActions {
  
  constructor(private store$: Store<any>) {}
  
  /**
   ** @REDUCER:
   *
   *
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Run async function to get data from indexed DB
   */
  static ACTION_INIT_ENTITY_FROM_LOCAL_DB = 'ACTION_INIT_ENTITY_FROM_LOCAL_DB';
  
  initDataFromDB(entityCode, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_INIT_ENTITY_FROM_LOCAL_DB, payload: {entityCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_ENTITY = 'ACTION_DELETE_ENTITY';
  
  deleteEntity(entityCode, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_DELETE_ENTITY, payload: {entityCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Remove entity in state
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Init entity from db
   */
  static ACTION_ENTITY_IN_DB_NOT_VALID = 'ACTION_ENTITY_IN_DB_NOT_VALID';
  
  entityInDBNotValid(entityCode, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_ENTITY_IN_DB_NOT_VALID, payload: {entityCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save entity data to state
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Pull entity data from server
   */
  static ACTION_GET_ENTITY_DATA_FROM_DB = 'ACTION_GET_ENTITY_DATA_FROM_DB';
  
  getEntityDataFromDB(entityCode, data, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_GET_ENTITY_DATA_FROM_DB, payload: {entityCode, data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save pulling and started pull entity
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Pull entity data from server
   */
  static ACTION_PULL_ENTITY_DATA_FROM_SERVER = 'ACTION_PULL_ENTITY_DATA_FROM_SERVER';
  
  pullEntityDataFromServer(entityCode, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER, payload: {entityCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save query pull next page
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Pull next page entity
   */
  static ACTION_PULL_ENTITY_NEXT_PAGE = 'ACTION_PULL_NEXT_PAGE';
  
  pullEntityNextPage(entityCode, query, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_PULL_ENTITY_NEXT_PAGE, payload: {entityCode, query}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save to entity items when pull success
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Pull next page entity
   */
  static ACTION_PULL_ENTITY_PAGE_SUCCESS = 'ACTION_PULL_PAGE_SUCCESS';
  
  pullEntityPageSuccess(entityCode, items, additionData, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS, payload: {entityCode, items, additionData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Update state pullingChain
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Assign data to core
   * Retrieve order count
   * Filter product in grid
   * Retrieve outlet and register
   * Trigger pull next entity
   * Check shift opening
   * Get all payment method can use
   */
  static ACTION_PULL_ENTITY_SUCCESS = 'ACTION_PULL_ENTITY_SUCCESS';
  
  pullEntitySuccess(entityCode, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS, payload: {entityCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_PULL_CANCEL = 'ACTION_PULL_CANCEL';
  
  /**
   ** @REDUCER:
   *
   *
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Pull entity failed
   */
  static ACTION_PULL_ENTITY_FAILED = 'ACTION_PULL_ENTITY_FAILED';
  
  pullEntityFailed(entityCode, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_PULL_ENTITY_FAILED, payload: {entityCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save data product filtered by setting
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Resolve product in grid
   */
  static ACTION_FILTERED_PRODUCTS = 'ACTION_FILTERED_PRODUCTS';
  
  filteredProducts(productsFiltered, dispatch: boolean = true): Action {
    const action = {type: PosEntitiesActions.ACTION_FILTERED_PRODUCTS, payload: {productsFiltered}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
