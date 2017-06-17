import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {PosPullActions} from "./pull.actions";
import {PosEntitiesActions} from "./entities.actions";
import {List} from "immutable";
import {ProgressBarService} from "../../../share/provider/progess-bar";
import {Observable} from "rxjs";
import {RootActions} from "../../../../R/root.actions";

@Injectable()
export class PosPullEffects {
  constructor(private actions$: Actions, private store: Store<any>, private progressBar: ProgressBarService, private entitiesActions: PosEntitiesActions) {}
  
  @Effect() pullEntities$ = this.actions$
                                .ofType(
                                  PosPullActions.ACTION_PULL_ENTITIES,
                                  // Repeat after each entity pull successful
                                  PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                .withLatestFrom(this.store.select('pull'))
                                .withLatestFrom(this.store.select('entities'),
                                                ([action, pullState], entitiesState) => [action, pullState, entitiesState])
                                .filter(([action, pullState]) => {
                                  return pullState['isPullingChain'] === true || pullState['pullingChain'].count() > 0;
                                })
                                .flatMap(([action, pullState, entitiesState]) => {
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
      
                                    let takeWhile = true;
                                    return Observable.interval(0)
                                                     .takeWhile(() => takeWhile)
                                                     .map(() => {
                                                       const entityNeedPull = pullingChain.find((entity) => pullingChainStarted.indexOf(entity) === -1);
                                                       if (entityNeedPull) {
                                                         pullingChainStarted = pullingChainStarted.push(entityNeedPull);
                                                         return this.entitiesActions.pullEntityDataFromServer(entityNeedPull,false);
                                                       } else {
                                                         takeWhile = false;
                                                         return {type: RootActions.ACTION_NOTHING, payload: {mess: "Nothing to pull entities"}}
                                                       }
                                                     });
                                  }
                                });
}
