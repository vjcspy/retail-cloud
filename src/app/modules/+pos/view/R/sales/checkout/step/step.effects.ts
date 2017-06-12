import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {PaymentDB} from "../../../../../database/xretail/db/payment";
import {List} from "immutable";
import {PosStepActions} from "./step.actions";

@Injectable()
export class PosStepEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions) { }
  
  @Effect() getPaymentCanUse = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                   .filter((action: Action) => action.payload['entityCode'] === PaymentDB.getCode())
                                   .withLatestFrom(this.store$.select('entities'))
                                   .map(([action, entitiesState]) => {
                                     const payments: List<PaymentDB> = entitiesState[PaymentDB.getCode()].items;
                                     let paymentMethodCanUse         = [];
                                     payments.forEach((p) => {
                                       if (!!p.is_active) {
                                         paymentMethodCanUse.push(p);
                                       }
                                     });
    
                                     return {type: PosStepActions.ACTION_GET_PAYMENT_METHOD_CAN_USE, payload: {paymentMethodCanUse}};
                                   });
}
