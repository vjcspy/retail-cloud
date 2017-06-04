import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {SHARE_PROVIDERS} from "./provider/index";
import {TranslateModule} from "ng2-translate";
import {SHARE_DIRECTIVES} from "./directives/index";

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
              ReactiveFormsModule,
    
              ...SHARE_DIRECTIVES
            ],
            declarations: [
              ...SHARE_DIRECTIVES
            ],
            providers: [...SHARE_PROVIDERS],
          })
export class ShareModule {
}
