import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {CountryHelper} from "../../../../../../core/framework/directory/Helper/CountryHelper";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-list-address',
             templateUrl: 'list-address.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailListAddressComponent implements OnInit {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() quoteState: PosQuoteState;
  public currentShippingAddId;
  
  constructor() { }
  
  ngOnInit() {
    if (this.quoteState.shippingAdd && this.quoteState.shippingAdd.hasOwnProperty('id')) {
      this.currentShippingAddId = this.quoteState.shippingAdd['id'];
    }
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
}
