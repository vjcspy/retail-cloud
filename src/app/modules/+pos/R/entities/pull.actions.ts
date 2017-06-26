import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PosPullActions {
  // Trigger để pull 1 chuỗi các entity
  static ACTION_PULL_ENTITIES = 'ACTION_PULL_ENTITIES';
  
  // Hoàn thành toàn bộ việc pull các entity
  static ACTION_PULL_ENTITIES_FULL = 'ACTION_PULL_ENTITIES_FULL';
  
  constructor(private store$: Store<any>) {}
  
  pullEntities(entitiesCode: string[], dispatch: boolean = true): Action {
    const action = {type: PosPullActions.ACTION_PULL_ENTITIES, payload: {entitiesCode}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
