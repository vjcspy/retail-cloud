import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class CheckoutProductActions {
  static ACTION_CALCULATE_GRID_STYLE = 'ACTION_CALCULATE_GRID_STYLE';
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_RESOLVE_CATALOG_PRODUCT = 'ACTION_RESOLVE_CATALOG_PRODUCT';
  
  resolveCatalogProduct(catalogProducts, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductActions.ACTION_RESOLVE_CATALOG_PRODUCT, payload: {catalogProducts}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  // Sau khi resolve product trong grid
  static ACTION_RESOLVE_GRID_PRODUCT = 'ACTION_RESOLVE_GRID_PRODUCT';
  
  resolvedGridProduct(data, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT, payload: {...data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save view property (width - height)
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SAVE_GRID_WIDTH_HEIGHT = 'ACTION_SAVE_GRID_WIDTH_HEIGHT';
  
  saveGridWidthHeight(gridWidth: number, gridHeight: number): void {
    this.store$.dispatch({type: CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT, payload: {gridWidth, gridHeight}});
  }
  
  /**
   ** @REDUCER:
   *
   * Update searching data
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * trigger ACTION_RESOLVE_GRID_PRODUCT
   */
  static ACTION_UPDATE_GRID_STATE = 'ACTION_UPDATE_GRID_STATE';
  
  updateGridState(data, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductActions.ACTION_UPDATE_GRID_STATE, payload: {...data}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_LOAD_MORE_PAGE = 'ACTION_LOAD_MORE_PAGE';
  
  loadMorePage(dispatch: boolean = true): Action {
    const action = {type: CheckoutProductActions.ACTION_LOAD_MORE_PAGE, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CHANGE_VIEW_MODE = 'ACTION_CHANGE_VIEW_MODE';
  
  changeViewMode(isGridMode: boolean, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductActions.ACTION_CHANGE_VIEW_MODE, payload: {isGridMode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_UPDATE_LUCKY_SEARCH = 'ACTION_UPDATE_LUCKY_SEARCH';
  
  updateLuckySearch(searchString, dispatch: boolean = true): Action {
    const action = {type: CheckoutProductActions.ACTION_UPDATE_LUCKY_SEARCH, payload: {searchString}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
