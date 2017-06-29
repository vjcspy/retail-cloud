import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class EntityOrderActions {
  
  constructor(private store$: Store<any>) { }
  
  /**
   ** @REDUCER:
   *
   * Only check and put order to entity, not in DB
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * NO THING
   */
  static ACTION_PUT_ORDER_ENTITY = 'ACTION_PUT_ORDER_ENTITY';
  
  /**
   * If key = null will push add new record
   * */
  putOrderEntity(order: any, key: string, dispatch: boolean = true): Action {
    const action = {type: EntityOrderActions.ACTION_PUT_ORDER_ENTITY, payload: {order, key}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
