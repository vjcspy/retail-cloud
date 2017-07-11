import {Component} from '@angular/core';
import {DialogQuestionData} from "./question.data";

@Component({
             // moduleId: module.id,
             selector: 'dialog-question',
             templateUrl: 'question.component.html'
           })

export class DialogQuestionComponent {
  constructor(public questionData: DialogQuestionData) { }
}
