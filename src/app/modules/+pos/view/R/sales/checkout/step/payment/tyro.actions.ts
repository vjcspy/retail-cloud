import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class TyroActions {
  static ACTION_INITED_TYRO_CONFIG    = 'ACTION_INITED_TYRO_CONFIG';
  static ACTION_CANCEL_PAY            = 'ACTION_CANCEL_PAY';
  static ACTION_SELECT_ANSWER         = 'ACTION_SELECT_ANSWER';
  static ACTION_WAIT_STREAM_FROM_TYRO = 'ACTION_WAIT_STREAM_FROM_TYRO';
  static ACTION_SET_TYRO_GATEWAY      = 'ACTION_SET_TYRO_GATEWAY';
  
  constructor(private store$: Store<any>) { }
  
  userSelectAnswer(answer: any) {
    this.store$.dispatch({type: TyroActions.ACTION_SELECT_ANSWER, payload: {answer}});
  }
}
