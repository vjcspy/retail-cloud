import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosPullActions {
  // Trigger để pull 1 chuỗi các entity
  static ACTION_PULL_ENTITIES = 'ACTION_PULL_ENTITIES';
  
  // Hoàn thành toàn bộ việc pull các entity
  static ACTION_PULL_ENTITIES_FULL = 'ACTION_PULL_ENTITIES_FULL';
  
  constructor(private store: Store<any>) {}
  
  pullEntities(entitiesCode: string[]): void {
    this.store.dispatch({type: PosPullActions.ACTION_PULL_ENTITIES, payload: {entitiesCode}});
  }
}
