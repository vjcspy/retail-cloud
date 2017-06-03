import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class RootActions {
  static ACTION_NOTHING = 'ACTION_NOTHING';
  static ACTION_ERROR   = 'ACTION_ERROR';
  
  constructor(private store: Store<any>) { }
  
}
