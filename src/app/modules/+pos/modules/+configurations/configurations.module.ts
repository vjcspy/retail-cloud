import {NgModule} from '@angular/core';
import {ShareModule} from "../../../share/share.module";
import {ConfigurationsComponent} from "./configurations.component";
import {DEFAULT_COMPONENTS} from "./view/default/index";
import {RouterModule} from "@angular/router";
import {CONFIGURATIONS_ROUTES} from "./configurations.routes";

@NgModule({
            imports: [
              ShareModule,
              RouterModule.forChild(CONFIGURATIONS_ROUTES),
            ],
            exports: [],
            declarations: [
              ConfigurationsComponent,
              ...DEFAULT_COMPONENTS
            ],
            providers: [],
          })
export class ConfigurationsModule {
}
