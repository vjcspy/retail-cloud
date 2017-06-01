import {PosDefaultTheme} from "./default";
import {PosDefaultSalesPage} from "./sales";
import {PosDefaultSalesCheckoutComponent} from "./sales/checkout.component";
import {PosDefaultSalesCheckoutGridComponent} from "./sales/checkout/grid.component";
import {PosDefaultSalesCheckoutTopBarComponent} from "./sales/checkout/top-bar.component";
import {PosDefaultSalesCheckoutBottomBarComponent} from "./sales/checkout/bottom-bar.component";
import {PosDefaultSalesCheckoutListComponent} from "./sales/checkout/list.component";
import {PosDefaultSalesCheckoutGridProductImageComponent} from "./sales/checkout/grid/product-image.component";

export const DEFAULT_VIEW_COMPONENTS = [
  PosDefaultTheme,
  
  PosDefaultSalesPage,
  
  PosDefaultSalesCheckoutComponent,
  PosDefaultSalesCheckoutTopBarComponent,
  PosDefaultSalesCheckoutGridComponent,
  PosDefaultSalesCheckoutGridProductImageComponent,
  PosDefaultSalesCheckoutListComponent,
  PosDefaultSalesCheckoutBottomBarComponent
];
