import {NgModule} from '@angular/core';
import {DialogQuestionService} from "./components/question.service";
import {DialogQuestionComponent} from "./components/question.component";
import {ShareModule} from "../share/share.module";
import {DialogService} from "./dialog.service";
import {DialogQuestionData} from "./components/question.data";

@NgModule({
            entryComponents: [DialogQuestionComponent],
            imports: [ShareModule],
            exports: [DialogQuestionComponent],
            declarations: [
              DialogQuestionComponent,
            ],
            providers: [
              DialogService,
              DialogQuestionData,
            ],
          })
export class DialogModule {
}
