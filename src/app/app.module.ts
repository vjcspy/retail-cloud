import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
// App is our top level component
import {AppComponent} from './app.component';
import {
  AppService
} from './app.service';

import {ROUTES} from "./app.routes";
import {DashboardComponent} from "./cloud/pages/dashboard/dashboard";
import {ProductCollection} from "./cloud/services/ddp/collections/products";
import {RouterModule} from "@angular/router";
import {ToastModule} from "ng2-toastr";
import {ContainerComponent} from "./cloud/cloud-container/container";
import {HeaderComponent} from "./cloud/cloud-container/container/header";
import {FooterComponent} from "./cloud/cloud-container/container/footer";
import {SideBarComponent} from "./cloud/cloud-container/container/sidebar";
import {SideOverlayComponent} from "./cloud/cloud-container/container/side-overlay";
import {PageNotFoundComponent} from "./cloud/pages/404/not-found";
import {AngularHelperModule} from "./code/angular/index";
import {AuthService} from "./cloud/services/ddp/auth.service";
import {AuthenticateGuard} from "./cloud/services/router-guard/authenticate";
import {UserCollection} from "./cloud/services/ddp/collections/users";
import {LicenseCollection} from "./cloud/services/ddp/collections/licenses";

import {PriceCollection} from "./cloud/services/ddp/collections/prices";
import {LoopGetKeyPipe} from "./cloud/pipes/LoopGetKeyPipe";
import {RequestService} from "./service/request";
import {SignInComponent} from "./cloud/pages/auth/signin";
import {SignUpComponent} from "./cloud/pages/auth/signup";
import {ResetPasswordComponent} from "./cloud/pages/auth/reset";
import {VerifyEmailComponent} from "./cloud/pages/auth/verify";
import {LockAccountComponent} from "./cloud/pages/auth/lock";
import {ProductsComponent} from "./cloud/pages/products/products";
import {APIManager} from "./cloud/services/api-manager";
import {DashboardWidgetComponent} from "./cloud/pages/dashboard/widget/dashboard-widget.component";
import {DashboardDataService} from "./cloud/services/data-managment/client-api/dashboard-data";
import {ElementModule} from "./cloud/elements/index";
import {CommonModule} from "@angular/common";
import {PriceFormatPipe} from "./cloud/pipes/price-format";


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
            bootstrap: [AppComponent],
            declarations: [
              AppComponent,
              PageNotFoundComponent,
              ContainerComponent,
              SideOverlayComponent,
              SideBarComponent,
              HeaderComponent,
              FooterComponent,
              ProductsComponent,
              LoopGetKeyPipe,
              SignInComponent,
              SignUpComponent,
              ResetPasswordComponent,
              VerifyEmailComponent,
              LockAccountComponent,
    
              DashboardComponent,
              DashboardWidgetComponent,
    
              //PIPE
              PriceFormatPipe
            ],
            imports: [ // import Angular's modules
              BrowserModule,
              FormsModule,
              CommonModule,
              HttpModule,
              AngularHelperModule,
              ToastModule.forRoot(),
              RouterModule.forRoot(ROUTES, {useHash: true}),
              ElementModule
            ],
            providers: [ // expose our Services and Providers into Angular's dependency injection
              ENV_PROVIDERS,
              AppService,
              PriceCollection,
              ProductCollection,
              UserCollection,
              LicenseCollection,
              PriceCollection,
              AuthService,
              AuthenticateGuard,
              RequestService,
              APIManager,
              DashboardDataService
            ]
          })
export class AppModule {
}
