import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosState} from "./pos.state";

@Injectable()
export class PosGeneralActions {
  static ACTION_SELECT_OUTLET_REGISTER = 'ACTION_SELECT_OUTLET_REGISTER';
  static ACTION_SELECT_WEBSITE         = 'ACTION_SELECT_WEBSITE';
  
  static ACTION_SAVE_STATE = 'ACTION_SAVE_STATE';
  
  static ACTION_GENERAL_STATE_NOT_VALID = 'ACTION_GENERAL_STATE_NOT_VALID';
  
  constructor(private store: Store<any>) {
  
  }
  
  selectWebsite(website: any): void {
    this.store.dispatch({type: PosGeneralActions.ACTION_SELECT_WEBSITE, payload: website});
  }
  
  selectOutletRegister(outletId: number, registerId): void {
    this.store.dispatch({type: PosGeneralActions.ACTION_SELECT_OUTLET_REGISTER, payload: {outletId, registerId}});
  }
}
