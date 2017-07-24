import {ChangeDetectionStrategy, Component, OnInit, Input} from '@angular/core';
import {CheckoutPopup, CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import * as _ from 'lodash';
import {CountryHelper} from "../../../../../../core/framework/directory/Helper/CountryHelper";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {CheckoutPopupActions} from "../../../../../R/sales/checkout/popup/popup.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-form',
             templateUrl: 'form.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailFormComponent implements OnInit {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() posConfigState: PosConfigState;
  
  public address;
  public type;
  public hasRegion = false;
  
  constructor(protected checkoutPopupActions: CheckoutPopupActions) { }
  
  ngOnInit() {
    this.address = _.clone(this.checkoutPopupState.customerPopup.editAddress);
    this.type    = this.isShippingPopup() ? 'shipping' : 'billing';
    
    if (!!this.address['id']) {
      this.address['isSaveToAddressBook'] = true;
    }
    
    if (!this.address['street'] || !_.isArray(this.address['street'])) {
      this.address['street'] = [];
    }
  }
  
  isShippingPopup() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOMER_SHIPPING;
  }
  
  getCountrySelectElem() {
    return CountryHelper.getCountrySelect();
  }
  
  changeCountry(countryId): void {
    if (typeof countryId !== 'undefined') {
      let country: any = _.find(CountryHelper.getCountries(), (v) => v['id'] === countryId);
      this.hasRegion   = !!(country && country.regions.length > 0);
    }
  }
  
  getRegionSelect(countryId): Object {
    return CountryHelper.getRegionSelect(countryId);
  }
  
  closePopup() {
    this.checkoutPopupActions.checkoutOpenPopup(null);
  }
}
