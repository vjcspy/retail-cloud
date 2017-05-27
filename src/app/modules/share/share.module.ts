import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {SHARE_PROVIDERS} from "./provider/index";

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule,
            ],
            exports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule
            ],
            declarations: [],
            providers: [...SHARE_PROVIDERS],
          })
export class ShareModule {
}
