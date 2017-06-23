import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {PosState} from "./pos.state";

@Injectable()
export class PosGeneralActions {
  constructor(private store$: Store<any>) {}
  
  static ACTION_SELECT_WEBSITE = 'ACTION_SELECT_WEBSITE';
  
  selectWebsite(website: any): void {
    this.store$.dispatch({type: PosGeneralActions.ACTION_SELECT_WEBSITE, payload: website});
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
  
  saveGeneralData(generalData, dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_SAVE_STATE, payload: {generalData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_GO_OUTLET_REGISTER_PAGE = 'ACTION_GO_OUTLET_REGISTER_PAGE';
  
  goOutletRegisterPage(redirect, dispatch: boolean = true): Action {
    const action = {type: PosGeneralActions.ACTION_GO_OUTLET_REGISTER_PAGE, payload: {redirect}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
