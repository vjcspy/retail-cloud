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
  PosDefaultSalesCheckoutCartComponent,
  PosDefaultSalesCheckoutActionBarComponent,
  PosDefaultSalesCheckoutActionsBarNoteComponent,
  PosDefaultSalesCheckoutCartCustomersComponent,
  PosDefaultSalesCheckoutCartItemsComponent,
  PosDefaultSalesCheckoutGrandTotalComponent
];
