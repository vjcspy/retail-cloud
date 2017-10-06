import {UserState} from "./user/user.state";
import {createReducer} from "../../../R/index";
import {userReducer} from "./user/user.reducer";
import {UserService} from "./user/user.service";
import {EffectsModule} from "@ngrx/effects";
import {UserEffects} from "./user/user.effects";
import {UserActions} from "./user/user.actions";

export interface CloudState {
  user: UserState;
}

export const R_EFFECTS  = [
  // EffectsModule.run(UserEffects),
];
export const R_SERVICES = [
  UserActions,
  UserService,
];

export const cloudReducer = () => createReducer({
                                                  user: userReducer
                                                });
