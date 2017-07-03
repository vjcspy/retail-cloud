import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {EntityOrderActions} from "./order.actions";
import {PosPullState} from "../pull.state";
import {PosPullActions} from "../pull.actions";

@Injectable()
export class EntityOrderEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private posPullActions: PosPullActions) { }
  
  @Effect() pullMoreOrder = this.actions$
                                .ofType(EntityOrderActions.ACTION_PULL_MORE_ORDER_ENTITY)
                                .debounceTime(500)
                                .withLatestFrom(this.store$.select('pull'))
                                .filter((z) => (z[1] as PosPullState).isPullingChain === false)
                                .map(() => {
                                  return this.posPullActions.pullEntities(['orders'], false);
                                });
  
}
