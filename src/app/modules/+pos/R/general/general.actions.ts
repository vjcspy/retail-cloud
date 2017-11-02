import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {PosState} from "./pos.state";

@Injectable()
export class PosGeneralActions {
  constructor(private store$: Store<any>) {}
  
  static ACTION_SELECT_WEBSITE = 'ACTION_SELECT_WEBSITE';
  
  selectWebsite(baseUrl, dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_SELECT_WEBSITE, payload: {baseUrl}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SELECT_OUTLET_REGISTER = 'ACTION_SELECT_OUTLET_REGISTER';
  
  selectOutletRegister(outletId: number, registerId): void {
    this.store$.dispatch({type: PosGeneralActions.ACTION_SELECT_OUTLET_REGISTER, payload: {outletId, registerId}});
  }
  
  /**
   ** @REDUCER:
   *
   * Save store,outlet,register data
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_SAVE_STATE = 'ACTION_SAVE_STATE';
  
  saveGeneralData(generalData, needRedirect: boolean = true, dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_SAVE_STATE, payload: {generalData, needRedirect}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * save redirect url
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_GO_OUTLET_REGISTER_PAGE = 'ACTION_GO_OUTLET_REGISTER_PAGE';
  
  goOutletRegisterPage(redirect, dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_GO_OUTLET_REGISTER_PAGE, payload: {redirect}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * save redirect url
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_GO_SALE_PAGE = 'ACTION_GO_SALE_PAGE';
  
  goCheckOutPage(redirect, dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_GO_SALE_PAGE, payload: {redirect}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  // static ACTION_RESOLVED_URLS = 'ACTION_RESOLVED_URLS';
  //
  // resolvedUrls(urls, dispatch: boolean = true): Action {
  //   const action = {type: PosGeneralActions.ACTION_RESOLVED_URLS, payload: {urls}};
  //
  //   if (dispatch === true) {
  //     this.store$.dispatch(action);
  //   }
  //
  //   return action;
  // }
  
  static ACTION_CLEAR_GENERAL_DATA = 'ACTION_CLEAR_GENERAL_DATA';
  
  clearGeneralData(dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_CLEAR_GENERAL_DATA, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
