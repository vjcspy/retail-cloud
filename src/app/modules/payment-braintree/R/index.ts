import {createReducer} from "../../../R/index";
import {braintreeReducer} from "./braintree/reducer";
import {EffectsModule} from "@ngrx/effects";
import {BraintreeEffects} from "./braintree/effects";
import {BraintreeActions} from "./braintree/actions";

export const R_EFFECTS  = [
  EffectsModule.run(BraintreeEffects)
];
export const R_SERVICES = [
  BraintreeActions
];

export const paymentBraintreeReducer = () => createReducer({
                                                  braintree: braintreeReducer,
                                                });
