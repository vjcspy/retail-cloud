import {ConfigurationsComponent} from "./configurations.component";
import {ConfigurationsDefaultContainerComponent} from "./view/default/container.component";
import {AuthGuard} from "../../../../services/router-guard/auth-guard";
import {Routes} from "@angular/router";
import {ConfigurationsDefaultPosComponent} from "./view/default/pos.component";
import {ConfigurationsDefaultCacheManagement} from "./view/default/cache-management.component";
import {PosConfigurationsDefaultPosProductCategoryComponent} from "./view/default/pos/product-category.component";
import {BaseUrlGuard} from "./services/router-guards/BaseUrlGuard";
import {ConfigurationsDefaultGeneralComponent} from "./view/default/general.component";
import {ConfigurationsDefaultPosCustomerComponent} from "./view/default/pos/customer.component";
import {ConfigurationsDefaultPosOutletRegisterComponent} from "./view/default/pos/outlet-register.component";
import {ConfigurationsDefaultPosOutletRegisterGridComponent} from "./view/default/pos/outlet-register/grid.component";
import {ConfigurationsDefaultPosOutletRegisterEditComponent} from "./view/default/pos/outlet-register/edit.component";
import {ConfigurationsDefaultPosOutletRegisterEditRegisterComponent} from "./view/default/pos/outlet-register/edit/register.component";
import {ConfigurationsDefaultPosPaymentComponent} from "./view/default/pos/payment.component";
import {ConfigurationsDefaultPosCheckoutComponent} from "./view/default/pos/checkout.component";
import {ConfigurationsDefaultPosIntegrationComponent} from "./view/default/pos/integration.component";
import {ConfigurationsDefaultPosReceiptComponent} from "./view/default/pos/receipt.component";
import {ConfigurationsDefaultCacheManagementMagentoProductComponent} from "./view/default/cache-management/magento-product.component";

export const CONFIGURATIONS_ROUTES: Routes = [
  {
    path: '',
    component: ConfigurationsComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'default',
        component: ConfigurationsDefaultContainerComponent,
        canActivate: [BaseUrlGuard],
        children: [
          {path: 'general', component: ConfigurationsDefaultGeneralComponent},
          
          {
            path: 'pos',
            component: ConfigurationsDefaultPosComponent,
            children: [
              {path: 'product-category', component: PosConfigurationsDefaultPosProductCategoryComponent},
              {path: 'customer', component: ConfigurationsDefaultPosCustomerComponent},
              {
                path: 'outlet',
                component: ConfigurationsDefaultPosOutletRegisterComponent,
                children: [
                  {path: 'grid', component: ConfigurationsDefaultPosOutletRegisterGridComponent},
                  {path: 'edit/:id', component: ConfigurationsDefaultPosOutletRegisterEditComponent},
                  {path: 'register-edit', component: ConfigurationsDefaultPosOutletRegisterEditRegisterComponent},
                ]
              },
              {path: 'payment', component: ConfigurationsDefaultPosPaymentComponent},
              {path: 'checkout', component: ConfigurationsDefaultPosCheckoutComponent},
              {path: 'integration', component: ConfigurationsDefaultPosIntegrationComponent},
              {path: 'receipt', component: ConfigurationsDefaultPosReceiptComponent},
            ]
          },
          
          {
            path: 'cache-management', component: ConfigurationsDefaultCacheManagement,
            children: [
              {path: 'magento-product', component: ConfigurationsDefaultCacheManagementMagentoProductComponent}
            ]
          },
        ]
      }
    ],
  },
];
