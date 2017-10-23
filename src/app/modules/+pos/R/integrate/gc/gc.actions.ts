import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class IntegrateGCActions {
  
  constructor(protected store$: Store<any>) { }
  
  static ACTION_USE_GIFT_CARD = 'ACTION_USE_GIFT_CARD';
  
  useGiftCard(gcData, dispatch: boolean = true): Action {
    const action = {type: IntegrateGCActions.ACTION_USE_GIFT_CARD, payload: {gcData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_REMOVE_GIFT_CARD = 'ACTION_REMOVE_GIFT_CARD';
  
  removeGiftCard(dispatch: boolean = true): Action {
    const action = {type: IntegrateGCActions.ACTION_REMOVE_GIFT_CARD, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
