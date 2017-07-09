import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CountryHelper} from "../../../../../../core/framework/directory/Helper/CountryHelper";
import {RetailConfigState} from "../../../../R/retail-config/retail-config.state";
import {RetailConfigService} from "../../../../R/retail-config/retail-config.service";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-customer-settings',
             templateUrl: 'settings.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosCustomerSettingsComponent {
  public _data            = {
    search_customer_by_attribute: {
      title: "CUSTOMER'S ATRIBUTES",
      data: [
        {
          label: "First Name",
          value: 'first_name'
        },
        {
          label: "Last Name",
          value: 'last_name'
        },
        {
          label: "Email",
          value: 'email'
        },
        {
          label: "Customer ID",
          value: 'id'
        },
        {
          label: "Telephone",
          value: 'telephone'
        }
      ]
    },
    search_order: {
      title: "Order's Fields",
      data: [
        {
          label: "Email",
          value: 'email'
        },
        {
          label: "Phone Number",
          value: 'telephone'
        },
        {
          label: "First Name",
          value: 'first_name'
        },
        {
          label: "Customer ID",
          value: 'customer_id'
        },
        {
          label: "Last Name",
          value: 'last_name'
        },
        {
          label: "Client Order ID",
          value: 'client_order_id'
        },
        {
          label: "Magento Order ID",
          value: 'magento_order_id'
        },
      ]
    },
  };
  protected countryHelper = new CountryHelper();
  
  @Input() retailConfigState: RetailConfigState;
  
  constructor(protected retailConfigService: RetailConfigService) {
  }
  
  getCountrySelect() {
    return this.countryHelper.getCountrySelect();
  }
  
  getRetailConfigSnapshot() {
    return this.retailConfigService.retailConfigSnapshot;
  }
}
