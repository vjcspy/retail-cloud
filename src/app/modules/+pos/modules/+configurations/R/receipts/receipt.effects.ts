import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {Router} from "@angular/router";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {ConfigurationsReceiptActions} from "./receipt.actions";

@Injectable()
export class ConfigurationsReceiptEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private configurationsReceiptActions: ConfigurationsReceiptActions) { }
  
  @Effect() checkLoadedDependency = this.actions$
                                        .ofType(
                                          PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                        )
                                        .filter(() => this.router.isActive('pos/configurations/default/pos', false))
                                        .withLatestFrom(this.store$.select('entities'))
                                        .map((z) => {
                                          const entitiesState: PosEntitiesState = <any>z[1];
    
                                          let loaded = false;
                                          if (entitiesState.receipts.isFinished === true) {
                                            loaded = true;
                                          }
    
                                          return this.configurationsReceiptActions.loadedDependency(loaded, false);
                                        });
}
