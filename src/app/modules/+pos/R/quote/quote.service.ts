import {Injectable} from '@angular/core';
import {Quote} from "../../core/framework/quote/Model/Quote";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {PosQuote} from "./quote";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";
import {PosGeneralState} from "../general/general.state";
import {Observable} from "rxjs";

@Injectable()
export class PosQuoteService {
  
  constructor(private request: RequestService, private apiManger: ApiManager) {}
  
  setCustomerToQuote(customer: Customer): Quote {
    const quote = PosQuote.getQuote();
    quote.setData('use_default_customer', customer.getData('is_default_customer'))
         .getCustomerSession()
         .setCustomer(customer)
         .setCustomerGroupId(customer.getCustomerGroupId());
    
    return quote;
  }
  
  checkShiftOpenInSV(generalState: PosGeneralState): Observable<any> {
    return this.request
               .makeGet(this.apiManger.get('check-open-shift', generalState.baseUrl) + `?outlet_id=${generalState.outlet['id']}&register_id=${generalState.register['id']}`)
  }
}
