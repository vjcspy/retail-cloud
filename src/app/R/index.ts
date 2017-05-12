import {ActionReducer, combineReducers, StoreModule} from "@ngrx/store";
import {StoreLogMonitorModule, useLogMonitor} from '@ngrx/store-log-monitor';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {RouterReducer, RouterState} from "./router/router.reducer";
import {RouterEffects} from "./router/router.effects";
import {RouterActions} from "./router/router.action";
import {EffectsModule} from "@ngrx/effects";

export interface AppState {
  router?: RouterState
}

export const rootReducers = {
  router: RouterReducer
};


export function createReducer(asyncReducers = {}): ActionReducer<any> {
  return combineReducers(Object.assign(rootReducers, asyncReducers));
}

export const rootReducer      = createReducer();
const STORE_DEV_TOOLS_IMPORTS = [];
STORE_DEV_TOOLS_IMPORTS.push(...[
  StoreDevtoolsModule.instrumentStore({
                                        monitor: useLogMonitor({
                                                                 visible: true,
                                                                 position: 'right'
                                                               })
                                      })]);

export const R_IMPORTS = [
  EffectsModule.run(RouterEffects),
  StoreModule.provideStore(rootReducer),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevtoolsModule,
  StoreLogMonitorModule
];

export const R_PROVIDERS = [
  RouterEffects,
  RouterActions
];
