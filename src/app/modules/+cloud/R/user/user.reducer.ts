import {ActionReducer} from "@ngrx/store";
import {userStateFactory, UserStateRecord} from "./user.state";

export const userReducer: ActionReducer<UserStateRecord> = (state = userStateFactory(), action) => {
  switch (action.type) {
    
    default:
      return state;
  }
};
