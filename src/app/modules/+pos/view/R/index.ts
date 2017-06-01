import {createReducer} from "../../../../R/index";
import {CheckoutState} from "./sales/checkout.state";
import {checkoutReducer} from "./sales/checkout.reducer";
import {PosCheckoutActions} from "./sales/checkout.actions";
import {PosCheckoutService} from "./sales/checkout.service";
import {EffectsModule} from "@ngrx/effects";
import {PosCheckoutEffects} from "./sales/checkout.effects";

export const R_POS_VIEW_IMPORTS = [
  EffectsModule.run(PosCheckoutEffects)
];

export const R_POS_VIEW_PROVIDERS = [
  PosCheckoutActions,
  PosCheckoutService,
  PosCheckoutEffects
];

/*Ở đây là interface bởi vì trong component, service... chỉ lấy data chứ không được set*/
export interface PosSalesState {
  checkout: CheckoutState;
}

export const posSalesReducer = createReducer({
                                               checkout: checkoutReducer,
                                             });
