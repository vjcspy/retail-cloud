import {NgModule} from '@angular/core';
import {ShareModule} from "../share/share.module";
import {RouterModule} from "@angular/router";
import {POS_ROUTES} from "./pos.routes";
import {R_POS_IMPORTS, R_POS_PROVIDERS} from "./R/index";
import {DEFAULT_VIEW_COMPONENTS} from "./view/default/index";
import {PosComponent} from "./pos.component";

@NgModule({
            imports: [
              ShareModule,
              RouterModule.forChild(POS_ROUTES),
              ...R_POS_IMPORTS
            ],
            exports: [],
            declarations: [
              PosComponent,
              ...DEFAULT_VIEW_COMPONENTS
            ],
            providers: [
              ...R_POS_PROVIDERS
            ],
          })
export class PosModule {
}
