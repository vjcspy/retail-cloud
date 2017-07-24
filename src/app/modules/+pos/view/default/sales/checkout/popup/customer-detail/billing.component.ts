import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {CustomerHelper} from "../../../../../../core/framework/customer/Helper/CustomerHelper";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-billing',
             templateUrl: 'billing.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailBillingComponent implements OnInit {
  public tabState = 'accountInfo';
  public type     = 'billing';
  
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() entitiesState: PosEntitiesState;
  @Input() quoteState: PosQuoteState;
  
  constructor() { }
  
  ngOnInit() { }
  
  showCustomerInformation() {}
  
  getCustomerGroupsSelect() {
    return CustomerHelper.getCustomerGroupSelectElem(this.entitiesState.customerGroup.items.toArray());
  }
}
