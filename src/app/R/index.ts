import {ActionReducer, combineReducers, StoreModule} from "@ngrx/store";
import {StoreLogMonitorModule, useLogMonitor} from "@ngrx/store-log-monitor";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {RootState} from "./root.state";
import {rootReducer} from "./root.reducer";
import {RootActions} from "./root.actions";

export interface AppState {
  rootState: RootState;
  
  [propName: string]: any;
}

const appReducers = {
  rootState: rootReducer,
};

export function createReducer(asyncReducers = {}): ActionReducer<any> {
  return combineReducers(Object.assign(appReducers, asyncReducers));
}

const STORE_DEV_TOOLS_IMPORTS = [];
STORE_DEV_TOOLS_IMPORTS.push(...[
  StoreDevtoolsModule.instrumentStore({
                                        monitor: useLogMonitor({
                                                                 visible: false,
                                                                 position: "right"
                                                               })
                                      })]);

export const R_IMPORTS = [
  StoreModule.provideStore(createReducer()),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevtoolsModule,
  StoreLogMonitorModule
];

export const R_PROVIDERS = [
  RootActions
];
