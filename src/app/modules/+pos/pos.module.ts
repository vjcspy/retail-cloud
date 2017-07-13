import {NgModule} from '@angular/core';
import {ShareModule} from "../share/share.module";
import {RouterModule} from "@angular/router";
import {POS_ROUTES} from "./pos.routes";
import {R_POS_IMPORTS, R_POS_PROVIDERS} from "./R/index";
import {DEFAULT_VIEW_COMPONENTS} from "./view/default/index";
import {PosComponent} from "./pos.component";
import {POS_SERVICES} from "./services/index";
import {R_POS_VIEW_IMPORTS, R_POS_VIEW_PROVIDERS} from "./view/R/index";
import {POS_PIPES} from "./view/pipes/index";
import {PosElementModule} from "../pos-element";
import {POS_DIRECTIVES} from "./view/directives/index";
import {DragScrollModule} from "angular2-drag-scroll";

import "../../../styles/pos.scss";
@NgModule({
            imports: [
              ShareModule,
              PosElementModule,
              RouterModule.forChild(POS_ROUTES),
              DragScrollModule,
              ...R_POS_IMPORTS,
              ...R_POS_VIEW_IMPORTS
            ],
            exports: [],
            declarations: [
              PosComponent,
              ...DEFAULT_VIEW_COMPONENTS,
              ...POS_DIRECTIVES,
              ...POS_PIPES
            ],
            providers: [
              ...POS_SERVICES,
              ...R_POS_PROVIDERS,
              ...R_POS_VIEW_PROVIDERS
            ],
          })
export class PosModule {
}
