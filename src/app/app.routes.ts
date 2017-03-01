import {DashboardComponent} from "./cloud/pages/dashboard/dashboard";
import {AdminAreaComponent} from "./cloud/pages/admin-area/admin-area";
import {ManageLicensesComponent} from "./cloud/pages/admin-area/manage-licenses";
import {ManageLicensesGridComponent} from "./cloud/pages/admin-area/manage-licenses/grid";
import {ManageProductsComponent} from "./cloud/pages/admin-area/manage-products";
import {ManageProductsGridComponent} from "./cloud/pages/admin-area/manage-products/grid";
import {ManageUsersComponent} from "./cloud/pages/admin-area/manage-users";
import {ManageUsersGridComponent} from "./cloud/pages/admin-area/manage-users/grid";
import {Routes} from "@angular/router";
import {ContainerComponent} from "./cloud/cloud-container/container";
import {PageNotFoundComponent} from "./cloud/pages/404/not-found";
import {AuthenticateGuard} from "./cloud/services/router-guard/authenticate";
import {SignInComponent} from "./cloud/pages/auth/signin";
import {SignUpComponent} from "./cloud/pages/auth/signup";
import {ResetPasswordComponent} from "./cloud/pages/auth/reset";
import {LockAccountComponent} from "./cloud/pages/auth/lock";
import {UserProfileComponent} from "./cloud/pages/profile/profile";
import {ManageShopComponent} from "./cloud/pages/manage-shop/manage-shop";
import {CashierGridComponent} from "./cloud/pages/manage-shop/children/cashier-grid";
import {ShopRolesComponent} from "./cloud/pages/manage-shop/children/shop-roles";
import {BillingPricingComponent} from "./cloud/pages/billing-pricing/billing-pricing";
import {CloudPricingComponent} from "./cloud/pages/billing-pricing/children/pricing";
import {CloudBillingComponent} from "./cloud/pages/billing-pricing/children/billing";
import {CreateLicenseComponent} from "./cloud/pages/admin-area/manage-licenses/create";
import {CreateProductComponent} from "./cloud/pages/admin-area/manage-products/create";

export const ROUTES: Routes = [
  {
    path      : '',
    redirectTo: '/cloud',
    pathMatch : 'full'
  },

  {
    path       : 'cloud',
    component  : ContainerComponent,
    canActivate: [AuthenticateGuard],
    children   : [
      {
        path     : '',
        component: DashboardComponent
      },
      {
        path     : 'profile',
        component: UserProfileComponent
      },

      /* ------------------------ Admin Area ------------------------ */
      {
        path     : 'licenses',
        component: ManageLicensesComponent,
        children : [
          {path: '', component: ManageLicensesGridComponent},
          {path: 'grid', component: ManageLicensesGridComponent},
          {path: 'create', component: CreateLicenseComponent}
        ]
      },
      {
        path     : 'products',
        component: ManageProductsComponent,
        children : [
          {path: '', component: ManageProductsGridComponent},
          {path: 'grid', component: ManageProductsGridComponent},
          {path: 'create', component: CreateProductComponent}
        ]
      },

      /* ------------------------ User Area ------------------------ */
      {
        path     : 'manage-shop',
        component: ManageShopComponent,
        children : [
          {path: '', component: CashierGridComponent},
          {path: 'grid', component: CashierGridComponent},
          {path: 'roles', component: ShopRolesComponent}
        ]
      },
      {
        path     : 'billing-pricing',
        component: BillingPricingComponent,
        children : [
          {path: '', component: CloudPricingComponent},
          {path: 'pricing', component: CloudPricingComponent},
          {path: 'billing', component: CloudBillingComponent}
        ]
      },
      {
        path     : 'users',
        component: ManageUsersComponent,
        children : [
          {path: '', component: ManageUsersGridComponent},
          {path: 'grid', component: ManageUsersGridComponent}
        ]
      }
    ]
  },
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'lock-account', component: LockAccountComponent},
  {path: '**', component: PageNotFoundComponent}
];