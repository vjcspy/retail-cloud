import {RetailConfigService} from "./retail-config/retail-config.service";
import {RetailConfigActions} from "./retail-config/retail-config.actions";
import {RetailConfigEffects} from "./retail-config/retail-config.effects";
import {EffectsModule} from "@ngrx/effects";
import {RetailConfigState} from "./retail-config/retail-config.state";
import {createReducer} from "../../../../../R/index";
import {retailConfigReducer} from "./retail-config/retail.config.reducer";
import {combineReducers} from "@ngrx/store";

export const R_IMPORT = [
  EffectsModule.run(RetailConfigEffects)
];

export const R_PROVIDER = [
  RetailConfigService,
  RetailConfigActions,
  RetailConfigEffects
];

export interface ConfigurationState {
  configurations: {
    retailConfig: RetailConfigState
  };
}

export const configurationsReducer = () => createReducer({
                                                           configurations: combineReducers({
                                                                                             retailConfig: retailConfigReducer
                                                                                           })
                                                         });
