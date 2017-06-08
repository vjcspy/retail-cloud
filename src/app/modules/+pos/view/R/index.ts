import {createReducer} from "../../../../R/index";
import {EffectsModule} from "@ngrx/effects";
import {CheckoutProductEffects} from "./sales/checkout/product/product.effects";
import {CheckoutProductActions} from "./sales/checkout/product/product.actions";
import {CheckoutProductService} from "./sales/checkout/product/product.service";
import {CheckoutProductState} from "./sales/checkout/product/product.state";
import {checkoutProductReducer} from "./sales/checkout/product/product.reducers";
import {cartCustomerReducer} from "./sales/checkout/cart/customer.reducer";
import {CartCustomerState} from "./sales/checkout/cart/customer.state";
import {CartCustomerActions} from "./sales/checkout/cart/customer.actions";
import {CartCustomEffects} from "./sales/checkout/cart/customer.effects";
import {CartCustomerService} from "./sales/checkout/cart/customer.service";
import {cartItemReducer} from "./sales/checkout/cart/item.reducer";
import {CartItemState} from "./sales/checkout/cart/item.state";
import {CartTotalsState} from "./sales/checkout/cart/totals.state";
import {cartTotalsReducer} from "./sales/checkout/cart/totals.reducer";
import {CartItemActions} from "./sales/checkout/cart/item.actions";
import {CartItemEffects} from "./sales/checkout/cart/item.effects";
import {CartItemService} from "./sales/checkout/cart/item.service";
import {CartActionBarState} from "./sales/checkout/cart/action-bar.state";
import {cartActionBarReducer} from "./sales/checkout/cart/action-bar.reducer";

export const R_POS_VIEW_IMPORTS = [
  EffectsModule.run(CheckoutProductEffects),
  EffectsModule.run(CartCustomEffects),
  EffectsModule.run(CartItemEffects),
];

export const R_POS_VIEW_PROVIDERS = [
  CheckoutProductActions,
  CheckoutProductEffects,
  CheckoutProductService,
  
  CartCustomerActions,
  CartCustomEffects,
  CartCustomerService,
  
  CartItemActions,
  CartItemEffects,
  CartItemService
];

/*Ở đây là interface bởi vì trong component, service... chỉ lấy data chứ không được set*/
export interface SalesState {
  checkoutProduct: CheckoutProductState;
  cartCustomer: CartCustomerState;
  cartItem: CartItemState;
  cartTotals: CartTotalsState;
  cartActionBar: CartActionBarState;
}

export const salesReducer = createReducer({
                                            checkoutProduct: checkoutProductReducer,
                                            cartCustomer: cartCustomerReducer,
                                            cartItem: cartItemReducer,
                                            cartTotals: cartTotalsReducer,
                                            cartActionBar: cartActionBarReducer
                                          });
