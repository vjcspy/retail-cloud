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
  PosDefaultSalesCheckoutPopupProductDetailBundleOptionsComponent
];
