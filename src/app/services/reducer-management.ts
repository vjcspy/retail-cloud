import {Injectable} from '@angular/core';
import {ActionReducer, Store} from "@ngrx/store";

@Injectable()
export class ReducerManagement {
  protected _reducer = {};
  
  constructor(private store$: Store<any>) { }
  
  replaceReducer(key: string, reducer: ActionReducer<any>) {
    if (!this._reducer.hasOwnProperty(key)) {
      this._reducer[key] = true;
      this.store$.replaceReducer(reducer);
    }
  }
}
