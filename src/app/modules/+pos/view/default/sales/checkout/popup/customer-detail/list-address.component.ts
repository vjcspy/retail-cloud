import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopup, CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {CountryHelper} from "../../../../../../core/framework/directory/Helper/CountryHelper";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../../R/quote/quote.actions";
import * as _ from 'lodash';
import {CheckoutPopupActions} from "../../../../../R/sales/checkout/popup/popup.actions";
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {AuthenticateService} from "../../../../../../../../services/authenticate";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-list-address',
             templateUrl: 'list-address.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailListAddressComponent implements OnInit {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() quoteState: PosQuoteState;
  
  public currentAddressId;
  public shippingAmount;
  
  constructor(protected posQuoteActions: PosQuoteActions,
              protected checkoutPopupActions: CheckoutPopupActions,
              public authenticateService: AuthenticateService,
              protected toastr: NotifyManager) { }
  
  ngOnInit() {
    if (this.isShippingPopup() && this.quoteState.shippingAdd && this.quoteState.shippingAdd.hasOwnProperty('id')) {
      this.currentAddressId = this.quoteState.shippingAdd['id'];
    } else if (!this.isShippingPopup() && this.quoteState.billingAdd && this.quoteState.billingAdd.hasOwnProperty('id')) {
      this.currentAddressId = this.quoteState.billingAdd['id'];
    }
    this.shippingAmount = this.quoteState.shippingAmount;
  }
  
  getCustomerFullAddress(address) {
    if (address.hasOwnProperty("region") && typeof address['region'] !== "undefined" && address['region'] !== null) {
      return address['street'] + " " + address['region'];
    } else {
      let _add = address['street'];
      
      if (address.hasOwnProperty('country_id')) {
        _add += ` ${CountryHelper.getCountryNameFromId(address['country_id'])}`;
      }
      
      if (address.hasOwnProperty("region_id") && address.hasOwnProperty('country_id')) {
        _add += ` ${CountryHelper.getRegionSelected(address['country_id'], address['region_id'])}`;
      }
      
      return _add;
    }
  }
  
  isShippingPopup() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOMER_SHIPPING;
  }
  
  changeShippingAmount($event) {
    this.posQuoteActions.addShippingAmount($event.target['value']);
  }
  
  addShipment() {
    if (isNaN(this.shippingAmount) || parseFloat(<any>this.shippingAmount) < 0) {
      this.toastr.warning("shipping_amount_must_be_positive_number");
      return;
    }
    let shippingAdd = _.find(this.checkoutPopupState.customerPopup.customer['address'], (_add) => parseInt(_add['id']) === parseInt(this.currentAddressId));
    if (!shippingAdd) {
      shippingAdd = null;
    }
    this.posQuoteActions.addShippingAmount(this.shippingAmount, shippingAdd);
  }
  
  removeShipping() {
    this.posQuoteActions.removeShipping();
  }
  
  addEditAddress(address = {}) {
    // if (_.isEmpty(address) || this.authenticateService.userCan('change_customer_information')) {
    if (this.authenticateService.userCan('change_customer_information')) {
      this.checkoutPopupActions.addNewCustomerAddress(address);
    } else {
      this.toastr.error("not_have_permission_to_change_customer_information");
    }
  }
  
  updateAddress() {
    let address = _.find(this.checkoutPopupState.customerPopup.customer['address'], (_add) => parseInt(_add['id']) === parseInt(this.currentAddressId));
    if (!!address) {
      this.posQuoteActions.setAddressToQuote(address, address, !this.isShippingPopup(), this.isShippingPopup());
    } else {
      this.posQuoteActions.setAddressToQuote(null, null, !this.isShippingPopup(), this.isShippingPopup());
    }
  }
}
