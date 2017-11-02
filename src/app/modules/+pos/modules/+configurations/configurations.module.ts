import {NgModule} from '@angular/core';
import {ShareModule} from "../../../share/share.module";
import {ConfigurationsComponent} from "./configurations.component";
import {DEFAULT_COMPONENTS} from "./view/default/index";
import {RouterModule} from "@angular/router";
import {CONFIGURATIONS_ROUTES} from "./configurations.routes";
import {R_VIEW_IMPORTS, R_VIEW_PROVIDER} from "./view/R/index";
import {PosElementModule} from "../../../pos-element/pos-element.module";
import {R_IMPORT, R_PROVIDER} from "./R/index";
import {FileUploadModule} from "ng2-file-upload";
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
            imports: [
              ShareModule,
              TranslateModule.forChild(),
              PosElementModule,
              FileUploadModule,
              FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
              RouterModule.forChild(CONFIGURATIONS_ROUTES),
              ...R_IMPORT,
              ...R_VIEW_IMPORTS,
            ],
            exports: [],
            declarations: [
              ConfigurationsComponent,
              ...DEFAULT_COMPONENTS
            ],
            providers: [
              ...R_PROVIDER,
              ...R_VIEW_PROVIDER,
            ],
          })
export class ConfigurationsModule {
}
