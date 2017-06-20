import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {PosPullActions} from "./pull.actions";
import {PosEntitiesActions} from "./entities.actions";
import {List} from "immutable";
import {ProgressBarService} from "../../../share/provider/progess-bar";
import {Observable} from "rxjs";

@Injectable()
export class PosPullEffects {
  constructor(private actions$: Actions, private store: Store<any>, private progressBar: ProgressBarService, private entitiesActions: PosEntitiesActions) {}
  
  @Effect() pullEntities$ = this.actions$
                                .ofType(
                                  PosPullActions.ACTION_PULL_ENTITIES,
                                  // Repeat after each entity pull successful
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                )
                                .withLatestFrom(this.store.select('pull'))
                                .withLatestFrom(this.store.select('entities'),
                                                ([action, pullState], entitiesState) => [action, pullState, entitiesState])
                                .filter(([action, pullState]) => {
                                  return pullState['isPullingChain'] === true || pullState['pullingChain'].count() > 0;
                                })
                                .switchMap(([action, pullState, entitiesState]) => {
                                  if (pullState['pullingChain'].count() === 0) {
                                    this.progressBar.done(true);
                                    return Observable.of({type: PosPullActions.ACTION_PULL_ENTITIES_FULL});
                                  } else {
                                    const pullEntitySuccess: List<string> = pullState['pullingChainSuccess'];
                                    let pullingChain: List<string>        = pullState['pullingChain'];
                                    let pullingChainStarted: List<string> = pullState['pullingChainStarted'];
      
                                    const totalProportionSuccess       = pullEntitySuccess.reduce((t, entityCode) => {
                                      return t + entitiesState[entityCode]['proportion'];
                                    }, 0);
                                    const totalProportionEntityPulling = pullingChain.reduce((t, entityCode) => {
                                      return t + entitiesState[entityCode]['proportion'];
                                    }, 0);
                                    this.progressBar.set(totalProportionSuccess * 100 / (totalProportionSuccess + totalProportionEntityPulling));
      
                                    let pullObservable = [];
                                    pullingChain.forEach((entity) => {
                                      if (pullingChainStarted.indexOf(entity) === -1) {
                                        pullObservable.push(this.entitiesActions.pullEntityDataFromServer(entity, false));
                                      }
                                    });
      
                                    return Observable.from(pullObservable);
                                  }
                                });
}
