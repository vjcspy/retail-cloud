import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ConfigurationsClientDbActions {
  
  constructor(private store$: Store<any>) { }
  
  static ACTION_RESOLVED_CONFIGURATIONS_ENTITIES = 'ACTION_RESOLVED_CONFIGURATIONS_ENTITIES';
  
  resolvedEntities(entities, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsClientDbActions.ACTION_RESOLVED_CONFIGURATIONS_ENTITIES, payload: {entities}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_DELETE_ENTITY = 'ACTION_REFRESH_ENTITY';
  
  deleteEntity(entity, dispatch: boolean = true): Action {
    const action = {type: ConfigurationsClientDbActions.ACTION_DELETE_ENTITY, payload: {entity}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
