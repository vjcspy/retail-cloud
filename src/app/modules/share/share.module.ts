import {NgModule} from "@angular/core";
import {Http, HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MomentModule} from "angular2-moment";
import {SHARE_PROVIDERS} from "./provider/index";
import {TranslateLoader, TranslateModule, TranslateStaticLoader} from "ng2-translate";
import {SHARE_DIRECTIVES} from "./directives/index";
import {LaddaModule} from "angular2-ladda";

export function retailTranslateLoader(http:Http){
  return new TranslateStaticLoader(http , 'assets/i18n/' , '.json');
}

@NgModule({
            imports: [
              CommonModule,
              FormsModule,
              HttpModule,
              MomentModule,
              TranslateModule.forRoot({
                                        provide: TranslateLoader,
                                        useFactory:(retailTranslateLoader),
                                        deps: [Http]
                                      }),
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
              ...SHARE_DIRECTIVES
            ],
            declarations: [
              ...SHARE_DIRECTIVES
            ],
            providers: [...SHARE_PROVIDERS],
          })
export class ShareModule {
}
