import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosState} from "./pos.state";

@Injectable()
export class PosActions {
  static ACTION_SELECT_OUTLET   = 'ACTION_SELECT_OUTLET';
  static ACTION_SELECT_REGISTER = 'ACTION_SELECT_REGISTER';
  
  constructor(private store: Store<any>) {
  
  }
  
  selectOutlet(outlet): void {
    this.store.dispatch({type: PosActions.ACTION_SELECT_OUTLET, payload: outlet});
  }
  
  selectRegister(register): void {
    this.store.dispatch({type: PosActions.ACTION_SELECT_REGISTER, payload: register});
  }
}
