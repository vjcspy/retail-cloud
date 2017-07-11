import {ConfigurationsViewRouterEffects} from "./router/router-effects";
import {EffectsModule} from "@ngrx/effects";

export const R_VIEW_IMPORTS  = [
  EffectsModule.run(ConfigurationsViewRouterEffects)
];
export const R_VIEW_PROVIDER = [
  ConfigurationsViewRouterEffects,
];

export interface ConfigurationsViewState {
}
