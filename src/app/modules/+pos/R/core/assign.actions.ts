import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class PosAssignActions {
  
  /**
   ** @REDUCER:
   *
   * Save assigned data
   *-----------------------------------------------------------------
   ** @EFFECTS:
   *
   *
   */
  static ACTION_ASSIGN_DATA_TO_CORE = 'ACTION_ASSIGN_DATA_TO_CORE';
  
  constructor(private store$: Store<any>) { }
  
  saveAssignedDataToCore(entityCode, dispatch: boolean = true): Action | void {
    const action = {type: PosAssignActions.ACTION_ASSIGN_DATA_TO_CORE, payload: {entityCode}};
    
    return dispatch === true ? this.store$.dispatch(action) : action;
  }
}
