import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosQuoteActions} from "./quote.actions";
import {PosEntitiesState} from "../entities/entities.state";
import {CustomerGroupDB} from "../../database/xretail/db/customer-group";
import {List} from "immutable";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {PosQuoteService} from "./quote.service";
import {PosEntitiesActions} from "../entities/entities.actions";
import {ShiftDB} from "../../database/xretail/db/shift";
import {Observable} from "rxjs";
import {RootActions} from "../../../../R/root.actions";

@Injectable()
export class PosQuoteEffects {
  constructor(private store$: Store<any>, private actions$: Actions, private quoteService: PosQuoteService) {}
  
  @Effect() setCustomerToQuote = this.actions$
                                     .ofType(PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE)
                                     .withLatestFrom(this.store$.select('entities'))
                                     .map((z) => {
                                       const customer: Customer                    = z[0].payload.customer;
                                       const entitiesState: PosEntitiesState       = z[1];
                                       const customerGroups: List<CustomerGroupDB> = entitiesState.customerGroup.items;
                                       const customerGroup                         = customerGroups.find((group: CustomerGroupDB) => parseInt(group['id']) === parseInt(customer['customer_group_id'] + ''));
    
                                       if (customerGroup) {
                                         customer.setData('tax_class_id', customerGroup['tax_class_id']);
                                       }
    
                                       return customer;
                                     })
                                     .map((customer: Customer) => {
                                       this.quoteService.setCustomerToQuote(customer);
    
                                       return {type: PosQuoteActions.ACTION_RESOLVE_QUOTE}
                                     });
  
  @Effect() checkShiftOpening = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                      '[Router] Update Location'
                                    )
                                    .filter((action: Action) => {
                                      if (action.type === PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS) {
                                        return action.payload['entityCode'] === ShiftDB.getCode();
                                      } else {
                                        return true;
                                      }
                                    })
                                    .withLatestFrom(this.store$.select('general'))
                                    .withLatestFrom(this.store$.select('entities'),
                                                    ([action, generalState], entitiesState) => [action, generalState, entitiesState])
                                    .switchMap((z) => {
                                      const shifts: List<any> = (z[2] as PosEntitiesState).shifts.items;
                                      const shiftOpening      = shifts.filter((s: ShiftDB) => parseInt(s.is_open) === 1);
                                      if (z[0].type == PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS || !!shiftOpening) {
                                        return Observable.of({
                                                               type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO,
                                                               payload: {isShiftOpening: !!shiftOpening}
                                                             });
                                      } else {
                                        return this.quoteService.checkShiftOpenInSV(z[1])
                                                   .map((data) => {
                                                     return {
                                                       type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO,
                                                       payload: {isShiftOpening: !!data['is_open']}
                                                     };
                                                   });
                                      }
                                    }).catch((e) => Observable.of({type: RootActions.ACTION_ERROR, payload: {e}}));
  
}
