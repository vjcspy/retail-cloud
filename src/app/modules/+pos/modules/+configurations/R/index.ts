import {RetailConfigService} from "./retail-config/retail-config.service";
import {RetailConfigActions} from "./retail-config/retail-config.actions";
import {RetailConfigEffects} from "./retail-config/retail-config.effects";
import {EffectsModule} from "@ngrx/effects";

export const R_IMPORT = [
  EffectsModule.run(RetailConfigEffects)
];

export const R_PROVIDER = [
  RetailConfigService,
  RetailConfigActions,
  RetailConfigEffects
];
