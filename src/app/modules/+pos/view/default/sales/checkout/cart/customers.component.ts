import {AfterViewInit, Component, Input} from '@angular/core';
import {CheckoutState} from "../../../../R/sales/checkout.state";
import {FormControl} from "@angular/forms";
import {AbstractSubscriptionComponent} from "../../../../../../../code/AbstractSubscriptionComponent";
import {PosConfigState} from "../../../../../R/config/config.state";
import * as _ from 'lodash';
import {PosCheckoutActions} from "../../../../R/sales/checkout.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-customers',
             templateUrl: 'customers.component.html'
           })
export class PosDefaultSalesCheckoutCartCustomersComponent extends AbstractSubscriptionComponent implements AfterViewInit {
  @Input() checkoutState: CheckoutState;
  @Input() configState: PosConfigState;
  protected cartCustomerSearchString = new FormControl();
  
  constructor(private checkoutAction: PosCheckoutActions) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.subscribeObservable('subscribe_search_customer',
                             () => this.cartCustomerSearchString
                                       .valueChanges
                                       .debounceTime(this.configState.constrain.debounceTimeSearch)
                                       .distinctUntilChanged()
                                       .subscribe((cartCustomerSearchString: string) => {
                                         this.checkoutAction.searchCustomer(cartCustomerSearchString);
                                       }));
  }
  
  protected customerTrackBy(index, customer: any) {
    return customer['id'];
  }
}
