import {
  NgModule,
  ApplicationRef
} from "@angular/core";
import {
  RouterModule,
  PreloadAllModules
} from "@angular/router";

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
// App is our top level component
import {AppComponent} from "./app.component";
import {APP_RESOLVER_PROVIDERS} from "./app.resolver";
import {AppState} from "./app.service";

import "../styles/styles.scss";
import "../styles/headings.css";
import {ShareModule} from "./modules/share/share.module";
import {R_IMPORTS, R_PROVIDERS} from "./modules/main/R/index";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterExternalModule} from "./modules/router/router.module";
import {MainModule} from "./modules/main";

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
            bootstrap: [AppComponent],
            declarations: [
              AppComponent,
            ],
            /**
             * Import Angular's modules.
             */
            imports: [
              ShareModule,
              R_IMPORTS,
              BrowserModule,
              BrowserAnimationsModule,
              RouterExternalModule,
              MainModule,
              RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules})
            ],
            /**
             * Expose our Services and Providers into Angular's dependency injection.
             */
            providers: [
              ENV_PROVIDERS,
              APP_PROVIDERS,
              R_PROVIDERS
            ]
          })
export class AppModule {
  constructor(public appRef: ApplicationRef,
              public appState: AppState) {}
}
