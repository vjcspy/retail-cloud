import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ROUTES} from "./router.routes";

@NgModule({
            imports: [RouterModule.forChild(ROUTES)]
          })
export class RouterExternalModule {
}
