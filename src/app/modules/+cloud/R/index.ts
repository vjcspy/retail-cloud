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
import {ProductEffects} from "./product/effects";
import {SalesState} from "./sales/state";
import {salesReducer} from "./sales/reducer";
import {CheckoutActions} from "./sales/checkout/actions";
import {CheckoutEffects} from "./sales/checkout/effects";
import {CheckoutService} from "./sales/checkout/service";
import {MenuState} from "./menu/state";
import {MenuEffects} from "./menu/effects";
import {MenuService} from "./menu/service";
import {MenuActions} from "./menu/actions";
import {menuReducer} from "./menu/reducer";

export interface CloudState {
  user: UserState;
  product: ProductState;
  pricing: PricingState;
  sales: SalesState;
  menu: MenuState;
}

export const R_EFFECTS  = [
  EffectsModule.run(PricingEffects),
  EffectsModule.run(ProductEffects),
  EffectsModule.run(CheckoutEffects),
  EffectsModule.run(MenuEffects),
];
export const R_SERVICES = [
  UserActions,
  UserService,
  
  ProductService,
  ProductActions,
  
  PricingActions,
  PricingService,
  
  CheckoutActions,
  CheckoutService,
  
  MenuService,
  MenuActions,
];

export const cloudReducer = () => createReducer({
                                                  user: userReducer,
                                                  pricing: pricingReducer,
                                                  product: productReducer,
                                                  sales: salesReducer,
                                                  menu: menuReducer,
                                                });
