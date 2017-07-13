import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {DataObject} from "../../../core/framework/General/DataObject";

@Injectable()
export class EntityActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_PUSH_ENTITY = 'ACTION_PUSH_ENTITY';
  
  pushEntity(item: DataObject, entityCode: string, key: string = 'id', dispatch: boolean = true): Action {
    const action = {type: EntityActions.ACTION_PUSH_ENTITY, payload: {item, entityCode, key}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_PUSH_MANY_ENTITY = 'ACTION_PUSH_MANY_ENTITY';
  
  pushManyEntity(items: DataObject[], entityCode: string, key: string = 'id', dispatch: boolean = true): Action {
    const action = {type: EntityActions.ACTION_PUSH_MANY_ENTITY, payload: {items, entityCode, key}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
