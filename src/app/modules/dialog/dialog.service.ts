import {ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';
import {DialogQuestionData} from "./components/question.data";
import {Subject} from "rxjs/Subject";
import {DialogQuestionComponent} from "./components/question.component";

@Injectable()
export class DialogService {
  protected _rootViewContainerRef: ViewContainerRef;
  protected _dialogSubject: Subject<any>;
  
  constructor(private questionData: DialogQuestionData, private componentFactoryResolver: ComponentFactoryResolver) { }
  
  setRootViewContainerRef(vcr: ViewContainerRef) {
    this._rootViewContainerRef = vcr;
  }
  
  title(title: string): DialogService {
    this.questionData.title = title;
    return this;
  }
  
  content(content: string): DialogService {
    this.questionData.content = content;
    return this;
  }
  
  whenYes(callBack: () => void): DialogService {
    this.questionData.whenYes = callBack;
    return this;
  }
  
  whenCancel(callBack: () => void): DialogService {
    this.questionData.whenCancel = callBack;
    return this;
  }
  
  confirm() {
    this.questionData.isOpening     = true;
    this._dialogSubject             = new Subject();
    let questionElem                = this.componentFactoryResolver.resolveComponentFactory(DialogQuestionComponent);
    this.questionData.componentElem = this._rootViewContainerRef.createComponent(questionElem);
    this._dialogSubject.asObservable().share();
  }
}
