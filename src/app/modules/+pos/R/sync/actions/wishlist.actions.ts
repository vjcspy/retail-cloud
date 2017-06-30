import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PosSyncWishlistActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_PUSH_WISHLIST = 'ACTION_PUSH_WISHLIST';
  
  pushWishlist(dispatch: boolean = true): Action {
    const action = {type: PosSyncWishlistActions.ACTION_PUSH_WISHLIST, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
