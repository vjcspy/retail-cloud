import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosQuoteActions} from "./quote.actions";
import {PosEntitiesState} from "../entities/entities.state";
import {CustomerGroupDB} from "../../database/xretail/db/customer-group";
import {List} from "immutable";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {PosQuoteService} from "./quote.service";

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
  
  
}
