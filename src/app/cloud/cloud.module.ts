import {NgModule} from '@angular/core';

import {Component} from './.component';
import {SignInPage} from "./pages/account/signin";
import {ElementModule} from "./elements/index";
import {COLLECTION_PROVIDER} from "./services/ddp/collections/index";
import {GUARD_PROVIDER} from "./services/router-guard/index";
import {AuthService} from "./services/auth";
import {API_PROVIDER} from "./services/api/index";
import {PriceFormatPipe} from "./pipes/price-format";
import {ResetPasswordPage} from "./pages/account/reset";
import {LockAccountPage} from "./pages/account/lock";
import {SignUpPage} from "./pages/account/signup";
import {VerifyEmailPage} from "./pages/account/verify";
import {RouterModule} from "@angular/router";
import {ROUTES} from "./cloud.routes";
import {ContainerComponent} from "./cloud-container/container";
import {HeaderComponent} from "./cloud-container/container/header";
import {FooterComponent} from "./cloud-container/container/footer";
import {SideOverlayComponent} from "./cloud-container/container/side-overlay";
import {SideBarComponent} from "./cloud-container/container/sidebar";
import {ProductPopup} from "./cloud-container/popup/products";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

const COMPONENTS = [
  /*COMPONENTS*/
  ContainerComponent,
  HeaderComponent,
  FooterComponent,
  SideOverlayComponent,
  SideBarComponent,
  ProductPopup,
  
  SignInPage,
  ResetPasswordPage,
  LockAccountPage,
  SignUpPage,
  VerifyEmailPage,
  
  /*PIPE*/
  PriceFormatPipe
];

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              HttpModule,
              ElementModule,
              RouterModule.forChild(ROUTES),
            ],
            exports: [ElementModule, CommonModule, FormsModule, HttpModule, ...COMPONENTS],
            declarations: [
              ...COMPONENTS
            ],
            providers: [
              AuthService,
              GUARD_PROVIDER,
              API_PROVIDER,
              COLLECTION_PROVIDER
            ],
          })
export class CloudModule {
}
