import {createReducer} from "../../../../../R/index";
import {paypalReducer} from "./paypal/reducer";
import {EffectsModule} from "@ngrx/effects";
import {PaypalEffects} from "./paypal/effects";
import {PaypalActions} from "./paypal/actions";
import {PaypalService} from "./paypal/service";

export const R_EFFECTS  = [
  EffectsModule.run(PaypalEffects)
];
export const R_SERVICES = [
  PaypalActions,
  PaypalService
];

export const paymentPaypalReducer = () => createReducer({
                                                          paypal: paypalReducer,
                                                        });
