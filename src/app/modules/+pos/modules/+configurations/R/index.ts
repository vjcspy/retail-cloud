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
import {ConfigurationsCacheState} from "./cache/cache.state";
import {configurationsCacheReducer} from "./cache/cache.reducer";
import {MagentoProductService} from "./cache/magento-product/magento-product.service";
import {MagentoProductActions} from "./cache/magento-product/magento-product.actions";
import {MagentoProductEffects} from "./cache/magento-product/magento-product.effects";
import {ConfigurationsClientDbService} from "./cache/client-db/client-db.service";
import {ConfigurationsClientDbActions} from "./cache/client-db/client-db.actions";
import {ConfigurationsClientDbEffects} from "./cache/client-db/client-db.effects";
import {PullPerformanceEffects} from "./cache/pull-performance/pull-performance.effects";
import {PullPerformanceActions} from "./cache/pull-performance/pull-performance.actions";

export const R_IMPORT = [
  EffectsModule.run(RetailConfigEffects),
  EffectsModule.run(ConfigurationsOutletEffects),
  EffectsModule.run(ConfigurationsPaymentEffects),
  EffectsModule.run(ConfigurationsReceiptEffects),
  EffectsModule.run(MagentoProductEffects),
  EffectsModule.run(ConfigurationsClientDbEffects),
  EffectsModule.run(PullPerformanceEffects),
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
  
  MagentoProductService,
  MagentoProductActions,
  
  ConfigurationsClientDbService,
  ConfigurationsClientDbActions,

  PullPerformanceActions,
];

export interface ConfigurationsState {
  retailConfig: RetailConfigState;
  outlets: ConfigurationsOutletState;
  payments: ConfigurationsPaymentState;
  receipt: ConfigurationsReceiptState;
  cache: ConfigurationsCacheState;
}

export interface ConfigurationModuleState {
  configurations: ConfigurationsState;
}

export const configurationsReducer = () => createReducer({
                                                           configurations: combineReducers({
                                                                                             retailConfig: retailConfigReducer,
                                                                                             outlets: configurationsOutletReducer,
                                                                                             payments: paymentReducer,
                                                                                             receipt: configurationsReceiptReducer,
                                                                                             cache: configurationsCacheReducer
                                                                                           })
                                                         });
