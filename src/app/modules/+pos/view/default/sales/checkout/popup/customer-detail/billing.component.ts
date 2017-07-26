import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {CustomerHelper} from "../../../../../../core/framework/customer/Helper/CustomerHelper";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {CheckoutPopupActions} from "../../../../../R/sales/checkout/popup/popup.actions";
import {FormValidationService} from "../../../../../../../share/provider/form-validation";
import {EntityCustomerActions} from "../../../../../../R/entities/entity/customer.actions";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-billing',
             templateUrl: 'billing.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailBillingComponent implements OnInit {
  public type = 'billing';
  
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() entitiesState: PosEntitiesState;
  @Input() quoteState: PosQuoteState;
  @Input() posConfigState: PosConfigState;
  
  constructor(protected checkoutPopupActions: CheckoutPopupActions,
              protected entityCustomerActions: EntityCustomerActions,
              protected formValidation: FormValidationService) { }
  
  ngOnInit() {
  
  }
  
  changeBillingState(state) {
    if (state !== 'others') {
      this.checkoutPopupActions.changeBillingTabView(state);
    } else {
      this.checkoutPopupActions.viewCustomerOtherInfo(this.checkoutPopupState.customerPopup.customer);
    }
  }
  
  getCustomerGroupsSelect() {
    return CustomerHelper.getCustomerGroupSelectElem(this.entitiesState.customerGroup.items.toArray());
  }
  
  cancelForm() {
    this.formValidation.cancel('pos-address-form-' + this.type, () => {
      this.checkoutPopupActions.checkoutOpenPopup(null);
    });
  }
  
  save() {
    this.formValidation.submit('pos-address-form-' + this.type, () => {
      this.entityCustomerActions.saveCustomerAddress(this.checkoutPopupState.customerPopup.customer, this.checkoutPopupState.customerPopup.editAddress);
    }, true);
  }
}
