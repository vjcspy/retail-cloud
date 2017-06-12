import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class IntegrateRpActions {
  static ACTION_USE_REWARD_POINT    = 'ACTION_USE_POINT';
  static ACTION_REMOVE_REWARD_POINT = 'ACTION_REMOVE_REWARD_POINT';
  
  constructor(private store$: Store<any>) { }
  
  usePoint(rpData): void {
    this.store$.dispatch({type: IntegrateRpActions.ACTION_USE_REWARD_POINT, payload: {rpData}});
  }
  
  removePoint(): void {
    this.store$.dispatch({type: IntegrateRpActions.ACTION_REMOVE_REWARD_POINT});
  }
}
