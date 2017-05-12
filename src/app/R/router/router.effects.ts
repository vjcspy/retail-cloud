import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Router} from "@angular/router";
import {RouterActions} from "./router.action";
import {Action} from "@ngrx/store";

@Injectable()
export class RouterEffects {
  
  constructor(private router: Router, private actions$: Actions) {
  }
  
  @Effect() navigate$ = this.actions$
                            .ofType(RouterActions.NAVIGATE)
                            .mergeMap((action: Action) => {
                              return this.router.navigate([action.payload['path']]);
                            })
                            .map((isSuccess) => {
                              return isSuccess ? {type: RouterActions.NAVIGATE_SUCCESS} : {type: RouterActions.NAVIGATE_FAILED}
                            });
}
