import {UserState} from "./user/user.state";
import {createReducer} from "../../../R/index";
import {userReducer} from "./user/user.reducer";
import {UserService} from "./user/user.service";
import {EffectsModule} from "@ngrx/effects";
import {UserActions} from "./user/user.actions";
import {PricingActions} from "./pricing/actions";
import {PricingService} from "./pricing/service";
import {pricingReducer} from "./pricing/reducer";
import {PricingEffects} from "./pricing/effects";
import {ProductService} from "./product/service";
import {ProductActions} from "./product/actions";
import {productReducer} from "./product/reducer";
import {ProductState} from "./product/state";
import {PricingState} from "./pricing/state";

export interface CloudState {
  user: UserState;
  product: ProductState;
  pricing: PricingState;
}

export const R_EFFECTS  = [
  EffectsModule.run(PricingEffects),
];
export const R_SERVICES = [
  UserActions,
  UserService,
  
  ProductService,
  ProductActions,
  
  PricingActions,
  PricingService,
];

export const cloudReducer = () => createReducer({
                                                  user: userReducer,
                                                  pricing: pricingReducer,
                                                  product: productReducer,
                                                });
