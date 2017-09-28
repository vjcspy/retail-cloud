import {PosDefaultTheme} from "./default";
import {PosDefaultSalesPage} from "./sales";
import {PosDefaultSalesCheckoutComponent} from "./sales/checkout.component";
import {PosDefaultSalesCheckoutGridComponent} from "./sales/checkout/grid.component";
import {PosDefaultSalesCheckoutTopBarComponent} from "./sales/checkout/top-bar.component";
import {PosDefaultSalesCheckoutBottomBarComponent} from "./sales/checkout/bottom-bar.component";
import {PosDefaultSalesCheckoutListComponent} from "./sales/checkout/list.component";
import {PosDefaultSalesCheckoutGridProductImageComponent} from "./sales/checkout/grid/product-image.component";
import {PosDefaultSalesCheckoutGrandTotalComponent} from "./sales/checkout/grand-total.component";
import {PosDefaultSalesOutletRegisterComponent} from "./outlet-register.component";
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
import {PosDefaultSalesReceiptComponent} from "./sales/receipt.component";
import {PosDefaultMenuLeftComponent} from "./sales/menu-left.component";
import {PosDefaultSalesOrdersComponent} from "./sales/orders.component";
import {PosDefaultSalesOrdersListComponent} from "./sales/orders/list.component";
import {PosDefaultSalesShiftsComponent} from "./sales/shifts.component";
import {PosDefaultSalesOrdersListItemComponent} from "./sales/orders/list/item.component";
import {PosDefaultSalesOrdersDetailComponent} from "./sales/orders/detail.component";
import {PosDefaultSalesOrdersDetailItemsComponent} from "./sales/orders/detail/items.component";
import {PosDefaultOutletRegisterWebsiteComponent} from "./outlet-register/website.component";
import {PosDefaultOutletRegisterOutletsComponent} from "./outlet-register/outlets.component";
import {PosDefaultSalesCheckoutCategoryComponent} from "./sales/checkout/category.component";
import {PosDefaultSalesCheckoutActionsBarOrderOnholdComponent} from "./sales/checkout/actions-bar/order-onhold.component";
import {PosDefaultSalesShiftsListComponent} from "./sales/shifts/list.component";
import {PosDefaultSalesShiftsListItemComponent} from "./sales/shifts/list/item.component";
import {PosDefaultSalesShiftDetailComponent} from "./sales/shifts/detail.component";
import {PosDefaultSalesShiftsPopupComponent} from "./sales/shifts/popup.component";
import {PosDefaultSalesShiftsPopupCloseComponent} from "./sales/shifts/popup/close.component";
import {PosDefaultSalesShiftsPopupOpenComponent} from "./sales/shifts/popup/open.component";
import {PosDefaultSalesShiftsPopupAdjustComponent} from "./sales/shifts/popup/adjust.component";
import {PosDefaultSalesShiftsReportComponent} from "./sales/shifts/report.component";
import {PosDefaultSalesCheckoutCartRefundItemsComponent} from "./sales/checkout/cart/refund-items.component";
import {PosDefaultSalesCheckoutPopupCustomSaleComponent} from "./sales/checkout/popup/custom-sale.component";
import {PosDefaultSalesCheckoutPopupCustomerDetailComponent} from "./sales/checkout/popup/customer-detail.component";
import {PosDefaultSalesCheckoutPopupCustomerDetailBillingComponent} from "./sales/checkout/popup/customer-detail/billing.component";
import {PosDefaultSalesCheckoutPopupCustomerDetailAddressComponent} from "./sales/checkout/popup/customer-detail/address.component";
import {PosDefaultSalesCheckoutPopupCustomerDetailShippingComponent} from "./sales/checkout/popup/customer-detail/shipping.component";
import {PosDefaultSalesCheckoutPopupCustomerDetailListAddressComponent} from "./sales/checkout/popup/customer-detail/list-address.component";
import {PosDefaultSalesCheckoutPopupCustomerDetailFormComponent} from "./sales/checkout/popup/customer-detail/form.component";
import {PosDefaultSalesCheckoutCartItemsItemComponent} from "./sales/checkout/cart/items/item.component";
import {PosDefaultSalesCheckoutCartRefundItemsItemComponent} from "./sales/checkout/cart/refund-items/item.component";
import {PosDefaultSalesCheckoutCartReferenceNumberComponent} from "./sales/checkout/cart/refenence-number.component";

export const DEFAULT_VIEW_COMPONENTS = [
  PosDefaultTheme,
  
  PosDefaultSalesPage,
  
  PosDefaultSalesOutletRegisterComponent,
  PosDefaultOutletRegisterWebsiteComponent,
  PosDefaultOutletRegisterOutletsComponent,
  
  PosDefaultMenuLeftComponent,
  PosDefaultSalesReceiptComponent,
  PosDefaultSalesCheckoutComponent,
  
  PosDefaultSalesCheckoutTopBarComponent,
  PosDefaultSalesCheckoutCategoryComponent,
  PosDefaultSalesCheckoutGridComponent,
  PosDefaultSalesCheckoutGridProductImageComponent,
  PosDefaultSalesCheckoutListComponent,
  PosDefaultSalesCheckoutBottomBarComponent,
  
  PosDefaultSalesCheckoutActionBarComponent,
  PosDefaultSalesCheckoutActionsBarNoteComponent,
  PosDefaultSalesCheckoutActionsBarOrderOnholdComponent,
  
  PosDefaultSalesCheckoutCartComponent,
  PosDefaultSalesCheckoutCartCustomersComponent,
  PosDefaultSalesCheckoutCartItemsComponent,
  PosDefaultSalesCheckoutCartItemsItemComponent,
  PosDefaultSalesCheckoutCartRefundItemsComponent,
  PosDefaultSalesCheckoutCartRefundItemsItemComponent,
  PosDefaultSalesCheckoutCartTotalsComponent,
  PosDefaultSalesCheckoutGrandTotalComponent,
  
  PosDefaultSalesCheckoutPopupComponent,
  PosDefaultSalesCheckoutPopupCustomerDetailComponent,
  PosDefaultSalesCheckoutPopupCustomerDetailBillingComponent,
  PosDefaultSalesCheckoutPopupCustomerDetailAddressComponent,
  PosDefaultSalesCheckoutPopupCustomerDetailShippingComponent,
  PosDefaultSalesCheckoutPopupCustomerDetailListAddressComponent,
  PosDefaultSalesCheckoutPopupCustomerDetailFormComponent,
  PosDefaultSalesCheckoutPopupCustomSaleComponent,
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
  CheckoutTyroComponent,
  
  PosDefaultSalesOrdersComponent,
  PosDefaultSalesOrdersListComponent,
  PosDefaultSalesOrdersListItemComponent,
  PosDefaultSalesOrdersDetailComponent,
  PosDefaultSalesOrdersDetailItemsComponent,
  
  PosDefaultSalesShiftsComponent,
  PosDefaultSalesShiftsListComponent,
  PosDefaultSalesShiftsListItemComponent,
  PosDefaultSalesShiftDetailComponent,
  PosDefaultSalesShiftsPopupComponent,
  PosDefaultSalesShiftsPopupCloseComponent,
  PosDefaultSalesShiftsPopupOpenComponent,
  PosDefaultSalesShiftsPopupAdjustComponent,
  PosDefaultSalesShiftsReportComponent,

  PosDefaultSalesCheckoutCartReferenceNumberComponent
];
