import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {PerformanceModuleState} from "../index";

@Injectable()
export class PullPerformanceActions {
  static ACTION_START_PULL   = 'ACTION_START_PULL';
  static ACTION_CANCEL_PULL  = 'ACTION_CANCEL_PULL';
  static ACTION_PULL_FAILED  = 'ACTION_PULL_FAILED';
  static ACTION_PULL_SUCCESS = 'ACTION_PULL_SUCCESS';
  
  static ACTION_PULL_NEXT_PAGE    = 'ACTION_PULL_NEXT_PAGE';
  static ACTION_PULL_PAGE_SUCCESS = 'ACTION_PULL_PAGE_SUCCESS';
  
  constructor(protected store$: Store<any>) { }
  
  static ACTION_LOADED_PULL_DEPENDENCY_ENTITY = 'ACTION_LOADED_PULL_DEPENDENCY_ENTITY';
  
  loadedDependencyEntity(isLoadedDepend, dispatch: boolean = true): Action {
    const action = {type: PullPerformanceActions.ACTION_LOADED_PULL_DEPENDENCY_ENTITY, payload: {isLoadedDepend}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  startPull(entity: string = 'product', storeId: number = 1, pageSize: number = 100): void {
    this.store$.dispatch({
                           type: PullPerformanceActions.ACTION_START_PULL,
                           payload: {
                             pageSize,
                             storeId,
                             entity,
                             currentPage: 0,
                             isPulling: true,
                           }
                         });
  }
  
  cancelPull(): void {
    this.store$.dispatch({type: PullPerformanceActions.ACTION_CANCEL_PULL});
  }
}
