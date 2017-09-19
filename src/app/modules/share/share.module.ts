import {NgModule} from "@angular/core";
import { HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {SHARE_PROVIDERS} from "./provider/index";
import {SHARE_DIRECTIVES} from "./directives/index";
import {LaddaModule} from "angular2-ladda";
import {SHARE_PIPES} from "./pipes/index";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
            imports: [
              CommonModule,
              TranslateModule.forChild(),
              FormsModule,
              HttpModule,
              MomentModule,
              ReactiveFormsModule,
              LaddaModule.forRoot({
                                    // style: "zoom-in",
                                    spinnerSize: 40,
                                    spinnerColor: "white",
                                    spinnerLines: 12
                                  })
            ],
            exports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule,
              TranslateModule,
              ReactiveFormsModule,
              LaddaModule,
              ...SHARE_DIRECTIVES,
              ...SHARE_PIPES
            ],
            declarations: [
              ...SHARE_DIRECTIVES,
              ...SHARE_PIPES
            ],
            providers: [...SHARE_PROVIDERS],
          })
export class ShareModule {
}
