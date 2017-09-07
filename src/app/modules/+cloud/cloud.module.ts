import {NgModule} from '@angular/core';
import {DEFAULT_VIEWS} from "./views/default/index";
import {ShareModule} from "../share/share.module";
import {RouterModule} from "@angular/router";
import {CLOUD_ROUTES} from "./cloud.routes";
import {CloudComponent} from "./cloud.component";

@NgModule({
            imports: [
              ShareModule,
              RouterModule.forChild(CLOUD_ROUTES),
            ],
            exports: [],
            declarations: [
              CloudComponent,
              ...DEFAULT_VIEWS
            ],
            providers: [],
          })
export class CloudModule {
}
