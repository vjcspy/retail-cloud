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
                                                                 visible: true,
                                                                 position: "right"
                                                               })
                                      })]);

export const R_IMPORTS = [
  StoreModule.provideStore(createReducer()),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevtoolsModule,
  StoreLogMonitorModule
];

/*
 * Có thể bao gồm service, actions và effects.
 *  - service: Không được phụ thuộc vào action hoặc effects và cũng không được phụ thuộc vào service nằm trong R
 *  - actions: Không được phụ thuộc vào service hoặc effects, đây chỉ là nơi cung cấp các actions trong R
 *  - effects: Được phụ thuộc service của nó và các service khác nằm trong R. Không được phụ thuộc actions.
 */
export const R_PROVIDERS = [
  RootActions
];
