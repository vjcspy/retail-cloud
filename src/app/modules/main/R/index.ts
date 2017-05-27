import {ActionReducer, combineReducers, StoreModule} from "@ngrx/store";
import {chickens, ChickenState} from "./chicken/chicken.reducer";
import {ChickenActions} from "./chicken/chicken.actions";
import {StoreLogMonitorModule, useLogMonitor} from "@ngrx/store-log-monitor";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

export interface AppState {
}

export const rootReducers = {};

export function createReducer(asyncReducers = {}): ActionReducer<any> {
  return combineReducers(Object.assign(rootReducers, asyncReducers));
}

export const rootReducer      = createReducer();
const STORE_DEV_TOOLS_IMPORTS = [];
STORE_DEV_TOOLS_IMPORTS.push(...[
  StoreDevtoolsModule.instrumentStore({
                                        monitor: useLogMonitor({
                                                                 visible: false,
                                                                 position: "right"
                                                               })
                                      })]);

export const R_IMPORTS = [
  StoreModule.provideStore(rootReducer),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevtoolsModule,
  StoreLogMonitorModule
];

export const R_PROVIDERS = [];
