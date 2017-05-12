import {NavigationExtras} from "@angular/router";
import {Action} from "@ngrx/store";
import {RouterActions} from "./router.action";

export interface RouterState {
  path: string;
  additionData?: any;
  navigationExtras?: NavigationExtras
}

export const RouterReducer = (state: RouterState = {path: ''}, action: Action): RouterState => {
  switch (action.type) {
    case RouterActions.NAVIGATE:
      return Object.assign({}, action.payload);
    default:
      return state;
  }
};
