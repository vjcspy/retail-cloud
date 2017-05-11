import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {
  NgModule,
} from '@angular/core';

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
import {DashboardComponent} from "./+modules/report/pages/dashboard/dashboard";
import {RouterModule} from "@angular/router";
import {ToastModule} from "ng2-toastr";
import {ContainerComponent} from "./cloud/cloud-container/container";
import {HeaderComponent} from "./cloud/cloud-container/container/header";
import {FooterComponent} from "./cloud/cloud-container/container/footer";
import {SideBarComponent} from "./cloud/cloud-container/container/sidebar";
import {SideOverlayComponent} from "./cloud/cloud-container/container/side-overlay";
import {PageNotFoundComponent} from "./cloud/pages/404/not-found";
import {AngularHelperModule} from "./code/angular/index";
import {DashboardWidgetComponent} from "./+modules/report/pages/dashboard/widget/dashboard-widget.component";
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
            ]
          })
export class AppModule {
}
