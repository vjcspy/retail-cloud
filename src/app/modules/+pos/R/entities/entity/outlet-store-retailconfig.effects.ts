import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {AccountActions} from "../../../../../R/account/account.actions";
import {GeneralEntityService} from "./outlet-store-retailconfig.service";
import {Observable} from "rxjs";
import {GeneralEntityActions} from "./outlet-store-retailconfig.actions";

@Injectable()
export class GeneralEntityEffects {
  
  constructor(private actions$: Actions, private generalEntityService: GeneralEntityService, private generalEntityActions: GeneralEntityActions) { }
  
  @Effect() clearOutletWhenLogout = this.actions$
                                        .ofType(AccountActions.ACTION_LOGOUT)
                                        .switchMap(() => {
                                          return Observable.fromPromise(this.generalEntityService.clearGeneralEntityIndexedData())
                                                           .map(() => this.generalEntityActions.clearedGeneralEntityIndexData(false));
                                        });
}
