import {NgModule} from "@angular/core";

import {RouterModule} from "@angular/router";
import {ShareModule} from "../share/share.module";
import {MAIN_ROUTES} from "./main.routes";
import {MAIN_PAGES} from "./pages/index";

@NgModule({
            imports: [ShareModule, RouterModule.forChild(MAIN_ROUTES)],
            declarations: [...MAIN_PAGES],
            providers: [],
          })
export class MainModule {
}
