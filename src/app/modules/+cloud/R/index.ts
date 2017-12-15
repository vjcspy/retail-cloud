import {createReducer} from "../../../R/index";
import {EffectsModule} from "@ngrx/effects";
import {PricingActions} from "./pricing/actions";
import {PricingService} from "./pricing/service";
import {pricingReducer} from "./pricing/reducer";
import {PricingEffects} from "./pricing/effects";
import {ProductService} from "./product/service";
import {ProductActions} from "./product/actions";
import {productReducer} from "./product/reducer";
import {ProductState} from "./product/state";
import {PricingState} from "./pricing/state";
import {ProductEffects} from "./product/effects";
import {SalesState} from "./sales/state";
import {salesReducer} from "./sales/reducer";
import {CheckoutActions} from "./sales/checkout/actions";
import {CheckoutEffects} from "./sales/checkout/effects";
import {CheckoutService} from "./sales/checkout/service";
import {MenuState} from "./menu/state";
import {MenuEffects} from "./menu/effects";
import {MenuService} from "./menu/service";
import {MenuActions} from "./menu/actions";
import {menuReducer} from "./menu/reducer";
import {ShopManageActions} from "./shop/actions";
import {ShopManageService} from "./shop/service";
import {ShopManageState} from "./shop/state";
import {shopManageReducer} from "./shop/reducer";
import {ShopManageEffects} from "./shop/effects";
import {LicenseActions} from "./license/actions";
import {LicenseService} from "./license/service";
import {LicenseEffects} from "./license/effects";

export interface CloudState {
  product: ProductState;
  pricing: PricingState;
  sales: SalesState;
  menu: MenuState;
  shopManage: ShopManageState;
}

export const R_EFFECTS  = [
  EffectsModule.run(PricingEffects),
  EffectsModule.run(ProductEffects),
  EffectsModule.run(CheckoutEffects),
  EffectsModule.run(MenuEffects),
  EffectsModule.run(ShopManageEffects),
  EffectsModule.run(LicenseEffects)
];
export const R_SERVICES = [
  ShopManageActions,
  ShopManageService,
  
  ProductService,
  ProductActions,
  
  PricingActions,
  PricingService,
  
  CheckoutActions,
  CheckoutService,
  
  MenuService,
  MenuActions,
  
  LicenseActions,
  LicenseService
];

export const cloudReducer = () => createReducer({
                                                  pricing: pricingReducer,
                                                  product: productReducer,
                                                  sales: salesReducer,
                                                  menu: menuReducer,
                                                  shopManage: shopManageReducer,
                                                });
