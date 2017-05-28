import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class EntitiesActions {
  static ACTION_GET_DATA_FROM_SERVER = 'ACTION_GET_DATA_FROM_SERVER';
  
  constructor(private store: Store<any>) {}
  
  getDataFromSv(entity: string): void {
    this.store.dispatch({type: EntitiesActions.ACTION_GET_DATA_FROM_SERVER, payload: entity});
  }
}
