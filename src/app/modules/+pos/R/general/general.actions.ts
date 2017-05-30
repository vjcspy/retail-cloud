import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosState} from "./pos.state";

@Injectable()
export class PosGeneralActions {
  static ACTION_SELECT_OUTLET   = 'ACTION_SELECT_OUTLET';
  static ACTION_SELECT_REGISTER = 'ACTION_SELECT_REGISTER';
  static ACTION_SELECT_WEBSITE  = 'ACTION_SELECT_WEBSITE';
  
  static ACTION_GENERAL_STATE_NOT_VALID = 'ACTION_GENERAL_STATE_NOT_VALID';
  
  constructor(private store: Store<any>) {
  
  }
  
  selectWebsite(website: any): void {
    this.store.dispatch({type: PosGeneralActions.ACTION_SELECT_WEBSITE, payload: website});
  }
  
  selectOutlet(outlet: any): void {
    this.store.dispatch({type: PosGeneralActions.ACTION_SELECT_OUTLET, payload: outlet});
  }
  
  selectRegister(register: any): void {
    this.store.dispatch({type: PosGeneralActions.ACTION_SELECT_REGISTER, payload: register});
  }
}
