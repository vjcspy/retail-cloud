import {Injectable} from '@angular/core';
import {Quote} from "../../core/framework/quote/Model/Quote";
import {Customer} from "../../core/framework/customer/Model/Customer";
import {PosQuote} from "./quote";

@Injectable()
export class PosQuoteService {
  
  
  setCustomerToQuote(customer: Customer): Quote {
    const quote = PosQuote.getQuote();
    quote.setData('use_default_customer', customer.getData('is_default_customer'))
         .getCustomerSession()
         .setCustomer(customer)
         .setCustomerGroupId(customer.getCustomerGroupId());
    
    return quote;
  }
}
