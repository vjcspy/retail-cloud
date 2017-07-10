import {ComponentRef, Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";

@Injectable()
export class DialogQuestionData {
  isOpening: boolean = false;
  title: string      = null;
  content: string    = null;
  whenYes: () => void;
  whenCancel: () => void;
  
  dialogQuestion: Subject<boolean>;
  componentElem: ComponentRef<any>;
  
  callBackCancel() {
    this.whenCancel();
    this.close();
  }
  
  callBackYes() {
    this.whenYes();
    this.isOpening = false;
    this.dialogQuestion.next(true);
  }
  
  protected close() {
    this.isOpening = false;
    this.componentElem.destroy();
    this.dialogQuestion.next(false);
    this.dialogQuestion.complete();
  }
}
