import {Injectable} from '@angular/core';
import {PosState} from "../index";
import {Store} from "@ngrx/store";

@Injectable()
export class EntitiesActions {
  static ACTION_GET_DATA_FROM_SERVER = 'ACTION_GET_DATA_FROM_SERVER';
  
  constructor(private store: Store<PosState>) {}
  
  getDataFromSv(): void {
    this.store.dispatch({type: EntitiesActions.ACTION_GET_DATA_FROM_SERVER});
  }
}
