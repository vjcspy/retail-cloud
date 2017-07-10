import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {go} from "@ngrx/router-store";

@Injectable()
export class RouterActions {
  
  constructor(private store$: Store<any>) { }
  
  go(path: string, param = null, query = {}) {
    this.store$.dispatch(go([path, param], query));
  }
  
}
