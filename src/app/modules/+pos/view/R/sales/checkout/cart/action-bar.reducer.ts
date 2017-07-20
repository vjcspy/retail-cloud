import {Action, ActionReducer} from "@ngrx/store";
import {cartActionBarFactory, CartActionBarRecord} from "./action-bar.state";
import {CartActionBarActions} from "./action-bar.actions";
import {PosSyncWishlistActions} from "../../../../../R/sync/actions/wishlist.actions";

export const cartActionBarReducer: ActionReducer<CartActionBarRecord> = (state = cartActionBarFactory(), action: Action) => {
  switch (action.type) {
    
    case CartActionBarActions.ACTION_CHANGE_MODE_ACTIONS_POPUP:
      return state.set('isOpenActions', action.payload['isOpenActions']);
    
    case CartActionBarActions.ACTION_SAVE_ORDER_ONHOLD:
    case PosSyncWishlistActions.ACTION_PUSH_WISHLIST:
      return state.set('isOpenActions', false);
    
    case CartActionBarActions.ACTION_CHANGE_MODE_POPUP:
      return state.set('isOpeningPopup', action.payload['isOpeningPopup'])
                  .set('isOpenActions', false);
    
    case CartActionBarActions.ACTION_RETRIEVE_ORDER_ONHOLD:
      return state.set('isOpeningPopup', null)
                  .set('isOpenActions', false);
    
    case CartActionBarActions.ACTION_RESOLVED_ORDER_ONHOLD:
      return state.set('orderOnhold', action.payload['orderOnhold']);
    
    case CartActionBarActions.SEARCH_ORDER_ONHOLD:
      return state.set('orderOnholdSearchString', action.payload['orderOnholdSearchString']);
    
    default:
      return state;
  }
};
