import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class TyroActions {
  static ACTION_START_PAY     = 'ACTION_START_PAY';
  static ACTION_CANCEL_PAY    = 'ACTION_CANCEL_PAY';
  static ACTION_SELECT_ANSWER = 'ACTION_SELECT_ANSWER';
  
  constructor(private store$: Store<any>) { }
  
  userSelectAnswer(answer: any) {
    this.store$.dispatch({type: TyroActions.ACTION_SELECT_ANSWER, payload: {answer}});
  }
}
