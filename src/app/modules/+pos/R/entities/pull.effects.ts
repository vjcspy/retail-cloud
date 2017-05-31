import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {PosPullActions} from "./pull.actions";
import {PosEntitiesActions} from "./entities.actions";
import {List} from "immutable";

@Injectable()
export class PosPullEffects {
  constructor(private actions$: Actions, private store: Store<any>) {}
  
  @Effect() pullEntities$ = this.actions$
                                .ofType(
                                  PosPullActions.ACTION_PULL_ENTITIES,
                                  // Repeat after each entity pull successful
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                .withLatestFrom(this.store.select('pull'))
                                .filter(([action, pullState]) => {
                                  return pullState['isPullingChain'] === true || pullState['pullingChain'].count() > 0;
                                })
                                .map(([action, pullState]) => {
                                  if (pullState['pullingChain'].count() === 0) {
                                    return {type: PosPullActions.ACTION_PULL_ENTITIES_FULL};
                                  } else {
                                    return {
                                      type: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER,
                                      payload: {entityCode: (pullState['pullingChain'] as List<string>).first()}
                                    };
                                  }
                                });
}
