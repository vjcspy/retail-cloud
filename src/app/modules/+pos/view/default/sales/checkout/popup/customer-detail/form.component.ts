import {ChangeDetectionStrategy, Component, OnInit, Input} from '@angular/core';
import {CheckoutPopup, CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import * as _ from 'lodash';
import {CountryHelper} from "../../../../../../core/framework/directory/Helper/CountryHelper";
import {PosConfigState} from "../../../../../../R/config/config.state";
import {CheckoutPopupActions} from "../../../../../R/sales/checkout/popup/popup.actions";
import {FormValidationService} from "../../../../../../../share/provider/form-validation";
import {EntityCustomerActions} from "../../../../../../R/entities/entity/customer.actions";

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
  
  constructor(protected checkoutPopupActions: CheckoutPopupActions,
              protected formValidation: FormValidationService,
              protected entityCustomerActions: EntityCustomerActions) { }
  
  ngOnInit() {
    this.address = _.clone(this.checkoutPopupState.customerPopup.editAddress);
    this.type    = this.isShippingPopup() ? 'shipping' : 'billing';
    
    if (!!this.address['id']) {
      this.address['isSaveToAddressBook'] = true;
    }
    
    if (!this.address['street'] || !_.isArray(this.address['street'])) {
      this.address['street'] = [];
    }
    
    this.initDefaultValueForAddressBaseOnCustomer();
  }
  
  protected initDefaultValueForAddressBaseOnCustomer() {
    if (this.checkoutPopupState.customerPopup.customer['first_name'] && !this.checkoutPopupState.customerPopup.editAddress['first_name']) {
      this.address['first_name'] = this.checkoutPopupState.customerPopup.customer['first_name'];
    }
    if (this.checkoutPopupState.customerPopup.customer['last_name'] && !this.checkoutPopupState.customerPopup.editAddress['last_name']) {
      this.address['last_name'] = this.checkoutPopupState.customerPopup.customer['last_name'];
    }
    if (this.checkoutPopupState.customerPopup.customer['telephone'] && !this.checkoutPopupState.customerPopup.editAddress['telephone']) {
      this.address['telephone'] = this.checkoutPopupState.customerPopup.customer['telephone'];
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
    this.formValidation.cancel('pos-address-form-' + this.type, () => {
      this.checkoutPopupActions.checkoutOpenPopup(null);
    });
  }
  
  save() {
    this.formValidation.submit('pos-address-form-' + this.type, () => {
      this.entityCustomerActions.saveCustomerAddress(this.checkoutPopupState.customerPopup.customer, this.address, this.type);
    }, true);
  }
}
