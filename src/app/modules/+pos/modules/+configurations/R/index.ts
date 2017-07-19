import {RetailConfigService} from "./retail-config/retail-config.service";
import {RetailConfigActions} from "./retail-config/retail-config.actions";
import {RetailConfigEffects} from "./retail-config/retail-config.effects";
import {EffectsModule} from "@ngrx/effects";
import {RetailConfigState} from "./retail-config/retail-config.state";
import {createReducer} from "../../../../../R/index";
import {retailConfigReducer} from "./retail-config/retail.config.reducer";
import {combineReducers} from "@ngrx/store";
import {ConfigurationsOutletState} from "./outlets/outlet.state";
import {configurationsOutletReducer} from "./outlets/outlets.reducer";
import {ConfigurationsOutletEffects} from "./outlets/outlet.effects";
import {ConfigurationsOutletService} from "./outlets/outlet.service";
import {ConfigurationsOutletActions} from "./outlets/outlet.actions";
import {ConfigurationsPaymentActions} from "./payment/payment.actions";
import {ConfigurationsPaymentEffects} from "./payment/payment.effects";
import {ConfigurationsPaymentService} from "./payment/payment.service";
import {ConfigurationsPaymentState} from "./payment/payment.state";
import {paymentReducer} from "./payment/payment.reducer";
import {configurationsReceiptReducer} from "./receipts/receip.reducer";
import {ConfigurationsReceiptState} from "./receipts/receipt.state";
import {ConfigurationsReceiptActions} from "./receipts/receipt.actions";
import {ConfigurationsReceiptService} from "./receipts/receipt.service";
import {ConfigurationsReceiptEffects} from "./receipts/receipt.effects";

export const R_IMPORT = [
  EffectsModule.run(RetailConfigEffects),
  EffectsModule.run(ConfigurationsOutletEffects),
  EffectsModule.run(ConfigurationsPaymentEffects),
  EffectsModule.run(ConfigurationsReceiptEffects),
];

export const R_PROVIDER = [
  RetailConfigService,
  RetailConfigActions,
  // RetailConfigEffects,
  
  // ConfigurationsOutletEffects,
  ConfigurationsOutletService,
  ConfigurationsOutletActions,
  
  ConfigurationsPaymentActions,
  // ConfigurationsPaymentEffects,
  ConfigurationsPaymentService,
  
  ConfigurationsReceiptActions,
  ConfigurationsReceiptService,
  // ConfigurationsReceiptEffects,
];

export interface ConfigurationsState {
  retailConfig: RetailConfigState;
  outlets: ConfigurationsOutletState;
  payments: ConfigurationsPaymentState;
  receipt: ConfigurationsReceiptState;
}

export interface ConfigurationModuleState {
  configurations: ConfigurationsState;
}

export const configurationsReducer = () => createReducer({
                                                           configurations: combineReducers({
                                                                                             retailConfig: retailConfigReducer,
                                                                                             outlets: configurationsOutletReducer,
                                                                                             payments: paymentReducer,
                                                                                             receipt: configurationsReceiptReducer
                                                                                           })
                                                         });
