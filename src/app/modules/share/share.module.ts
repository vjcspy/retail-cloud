import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {SHARE_PROVIDERS} from "./provider/index";
import {TranslateModule} from "ng2-translate";

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule,
              TranslateModule,
              ReactiveFormsModule
            ],
            exports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule,
              TranslateModule,
              ReactiveFormsModule
            ],
            declarations: [],
            providers: [...SHARE_PROVIDERS],
          })
export class ShareModule {
}
