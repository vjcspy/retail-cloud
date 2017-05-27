import {NgModule} from "@angular/core";

import {RouterModule} from "@angular/router";
import {ShareModule} from "../share/share.module";
import {MAIN_ROUTES} from "./main.routes";

@NgModule({
            imports: [ShareModule, RouterModule.forChild(MAIN_ROUTES)],
            declarations: [],
            providers: [],
          })
export class MainModule {
}
