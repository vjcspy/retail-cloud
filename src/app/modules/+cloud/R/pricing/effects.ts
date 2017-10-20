import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PricingActions} from "./actions";
import {PricingService} from "./service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PricingEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected pricingActions: PricingActions,
              protected pricingService: PricingService) { }
  
  @Effect() savePricing = this.actions$
                              .ofType(
                                PricingActions.ACTION_SAVE_PRICE
                              )
                              .switchMap((z: any) => {
                                const action: Action = z;
                                return Observable.fromPromise(this.pricingService.savePricing(action.payload['pricing']))
                                                 .map(() => this.pricingActions.savePricingSuccess(null, false))
                                                 .catch((e) => Observable.of(this.pricingActions.savePricingFail(e && e['reason'] ?
                                                                                                                   e['reason'] : '', false)));
                              });
}
