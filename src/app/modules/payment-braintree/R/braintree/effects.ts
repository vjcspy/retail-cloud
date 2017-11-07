import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {BraintreeActions} from "./actions";
import {Observable} from "rxjs/Observable";
import {Braintree} from "../../services/payments/braintree";
import {Action} from "@ngrx/store";

@Injectable()
export class BraintreeEffects {
  
  constructor(protected actions$: Actions,
              protected braintreeActions: BraintreeActions,
              protected braintree: Braintree) { }
  
  @Effect() createDropin = this.actions$
                               .ofType(BraintreeActions.ACTION_BRAINTREE_DROPIN_CREATE)
                               .switchMap((z: any) => {
                                 const action: Action = z;
                                 
                                 return Observable.fromPromise(this.braintree.initClient(action.payload['button']))
                                                  .map(() => {
                                                    return this.braintreeActions.dropinCreateSuccess(false);
                                                  });
                               });
}
