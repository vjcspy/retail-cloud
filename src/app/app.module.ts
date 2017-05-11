import {
  NgModule,
} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

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
import {RouterModule} from "@angular/router";
import {ToastModule} from "ng2-toastr";
import {AngularHelperModule} from "./code/angular/index";
import {CloudModule} from "./cloud/";
import {NotFoundPage} from "./code/angular/components/not-found";
import {BrowserModule} from "@angular/platform-browser";

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
            bootstrap: [AppComponent],
            declarations: [
              AppComponent,
              NotFoundPage
            ],
            imports: [ // import Angular's modules
              BrowserModule,
              BrowserAnimationsModule,
              CloudModule,
              AngularHelperModule,
              ToastModule.forRoot(),
              RouterModule.forRoot(ROUTES, {useHash: true}),
            ],
            providers: [ // expose our Services and Providers into Angular's dependency injection
              ENV_PROVIDERS,
              AppService,
            ]
          })
export class AppModule {
}
