import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class RootActions {
  static ACTION_NOTHING = 'ACTION_NOTHING';
  
  constructor(private store: Store<any>) { }
  
}
