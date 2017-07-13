import {NgModule} from '@angular/core';
import {DialogQuestionService} from "./components/question.service";
import {DialogQuestionComponent} from "./components/question.component";
import {ShareModule} from "../share/share.module";
import {DialogService} from "./dialog.service";
import {DialogQuestionData} from "./components/question.data";
import {DialogInfoData} from "./components/info.data";
import {DialogInfoComponent} from "./components/info.component";

@NgModule({
            entryComponents: [
              DialogQuestionComponent,
              DialogInfoComponent
            ],
            imports: [ShareModule],
            exports: [DialogQuestionComponent, DialogInfoComponent],
            declarations: [
              DialogQuestionComponent,
              DialogInfoComponent
            ],
            providers: [
              DialogService,
              DialogQuestionData,
              DialogInfoData,
            ],
          })
export class DialogModule {
}
