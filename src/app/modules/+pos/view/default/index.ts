import {PosDefaultTheme} from "./default";
import {PosDefaultSalesPage} from "./sales";
import {PosDefaultSalesCheckoutComponent} from "./sales/checkout.component";
import {PosDefaultSalesCheckoutGridComponent} from "./sales/checkout/grid.component";
import {PosDefaultSalesCheckoutTopBarComponent} from "./sales/checkout/top-bar.component";
import {PosDefaultSalesCheckoutBottomBarComponent} from "./sales/checkout/bottom-bar.component";
import {PosDefaultSalesCheckoutListComponent} from "./sales/checkout/list.component";
import {PosDefaultSalesCheckoutGridProductImageComponent} from "./sales/checkout/grid/product-image.component";
import {PosDefaultSalesCheckoutGrandTotalComponent} from "./sales/checkout/grand-total.component";
import {PosDefaultSalesOutletRegisterComponent} from "./sales/outlet-register.component";
import {PosDefaultSalesCheckoutCartComponent} from "./sales/checkout/cart.component";
import {PosDefaultSalesCheckoutCartCustomersComponent} from "./sales/checkout/cart/customers.component";
import {PosDefaultSalesCheckoutActionBarComponent} from "./sales/checkout/actions-bar.component";
import {PosDefaultSalesCheckoutActionsBarNoteComponent} from "./sales/checkout/actions-bar/note.component";
import {PosDefaultSalesCheckoutCartItemsComponent} from "./sales/checkout/cart/items.component";
import {PosDefaultSalesCheckoutCartTotalsComponent} from "./sales/checkout/cart/totals.component";
import {PosDefaultSalesCheckoutPopupComponent} from "./sales/checkout/popup.component";
import {PosDefaultSalesCheckoutPopupProductDetailComponent} from "./sales/checkout/popup/product-detail.component";
import {PosDefaultSalesCheckoutPopupProductDetailCustomizableOptionsComponent} from "./sales/checkout/popup/product-detail/customizable-options.component";
import {PosDefaultSalesCheckoutPopupProductDetailBundleOptionsComponent} from "./sales/checkout/popup/product-detail/bundle-options.component";
import {PosDefaultSalesCheckoutPopupProductDetailSuperGroupComponent} from "./sales/checkout/popup/product-detail/super-group.component";
import {PosDefaultSalesCheckoutPopupProductDetailSuperAttributeComponent} from "./sales/checkout/popup/product-detail/super-attribute.component";
import {PosDefaultSalesCheckoutStepComponent} from "./sales/checkout/step.component";
import {PosDefaultSalesCheckoutStepPaymentsComponent} from "./sales/checkout/step/payment.component";
import {CheckoutCashComponent} from "./sales/checkout/step/payment/cash.component";
import {CheckoutCreditCardComponent} from "./sales/checkout/step/payment/credit-card.component";
import {CheckoutRewardPointComponent} from "./sales/checkout/step/payment/rewardpoint.component";
import {CheckoutTyroComponent} from "./sales/checkout/step/payment/tyro.component";
import {PosDefaultSalesCheckoutStepCompleteComponent} from "./sales/checkout/step/complete.component";

export const DEFAULT_VIEW_COMPONENTS = [
  PosDefaultTheme,
  
  PosDefaultSalesPage,
  
  PosDefaultSalesOutletRegisterComponent,
  
  PosDefaultSalesCheckoutComponent,
  
  PosDefaultSalesCheckoutTopBarComponent,
  PosDefaultSalesCheckoutGridComponent,
  PosDefaultSalesCheckoutGridProductImageComponent,
  PosDefaultSalesCheckoutListComponent,
  PosDefaultSalesCheckoutBottomBarComponent,
  
  PosDefaultSalesCheckoutActionBarComponent,
  PosDefaultSalesCheckoutActionsBarNoteComponent,
  
  PosDefaultSalesCheckoutCartComponent,
  PosDefaultSalesCheckoutCartCustomersComponent,
  PosDefaultSalesCheckoutCartItemsComponent,
  PosDefaultSalesCheckoutCartTotalsComponent,
  PosDefaultSalesCheckoutGrandTotalComponent,
  
  PosDefaultSalesCheckoutPopupComponent,
  PosDefaultSalesCheckoutPopupProductDetailComponent,
  PosDefaultSalesCheckoutPopupProductDetailCustomizableOptionsComponent,
  PosDefaultSalesCheckoutPopupProductDetailBundleOptionsComponent,
  PosDefaultSalesCheckoutPopupProductDetailSuperGroupComponent,
  PosDefaultSalesCheckoutPopupProductDetailSuperAttributeComponent,
  
  PosDefaultSalesCheckoutStepComponent,
  PosDefaultSalesCheckoutStepCompleteComponent,
  PosDefaultSalesCheckoutStepPaymentsComponent,
  CheckoutCashComponent,
  CheckoutCreditCardComponent,
  CheckoutRewardPointComponent,
  CheckoutTyroComponent
];
