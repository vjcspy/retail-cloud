import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CheckoutState} from "../../../../R/sales/checkout.state";
import {FormControl} from "@angular/forms";
import {AbstractSubscriptionComponent} from "../../../../../../../code/AbstractSubscriptionComponent";
import {PosConfigState} from "../../../../../R/config/config.state";
import {PosCheckoutActions} from "../../../../R/sales/checkout.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-customers',
             templateUrl: 'customers.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class PosDefaultSalesCheckoutCartCustomersComponent extends AbstractSubscriptionComponent implements AfterViewInit {
  @Input() checkoutState: CheckoutState;
  @Input() configState: PosConfigState;
  protected cartCustomerSearchString = new FormControl();
  
  constructor(protected checkoutActions: PosCheckoutActions, protected quoteActions: PosQuoteActions) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.subscribeObservable('subscribe_search_customer',
                             () => this.cartCustomerSearchString
                                       .valueChanges
                                       .debounceTime(this.configState.constrain.debounceTimeSearch)
                                       .distinctUntilChanged()
                                       .subscribe((cartCustomerSearchString: string) => {
                                         this.checkoutActions.searchCustomer(cartCustomerSearchString);
                                       }));
  }
  
  protected customerTrackBy(index, customer: any) {
    return customer['id'];
  }
}
