import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TaxClassHelper} from "../../../../../../core/framework/tax/Helper/TaxClass";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {RetailConfigService} from "../../../../R/retail-config/retail-config.service";

@Component({
             // moduleId: module.id,
             selector: 'product-category-settings',
             templateUrl: 'settings.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosConfigurationsDefaultPosProductCategorySettingsComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  protected taxClassHelper = new TaxClassHelper();
  protected _data          = {};
  
  constructor(protected retailConfigService: RetailConfigService) { }
  
  ngOnInit() {
    this.initProductCategoryConfigurationData();
    console.log(this.getRetailConfigSnapshot());
  }
  
  protected initProductCategoryConfigurationData() {
    this._data = {
      show_product_by_type: {
        title: "Product type",
        data: [
          {
            label: "Simple",
            value: 'simple'
          },
          {
            label: "Virtual",
            value: 'virtual'
          },
          {
            label: "Bundle",
            value: 'bundle'
          },
          {
            label: "Grouped",
            value: 'grouped'
          },
          {
            label: "Configurable",
            value: 'configurable'
          }
        ]
      },
      show_product_by_visibility: {
        title: "Product Visible",
        data: [
          {
            label: "Catalog",
            value: '2'
          },
          {
            label: "Search",
            value: '3'
          },
          {
            label: "Catalog, Search",
            value: '4'
          },
          {
            label: "Not Visible Individually",
            value: '1'
          },
        ]
      },
      search_product_attribute: {
        title: "Product Attributes",
        data: [
          {
            label: "ID",
            value: 'id'
          },
          {
            label: "Name",
            value: 'name'
          },
          {
            label: "Sku",
            value: 'sku'
          },
          {
            label: "Price",
            value: 'price'
          },
          {
            label: "Type",
            value: 'type_id'
          },
        ]
      },
      sort_product_base_on: {
        title: "SORT PRODUCT BASED ON",
        data: [
          {
            label: "Product ID",
            value: 'id'
          },
          {
            label: "Product SKU",
            value: 'sku'
          },
          {
            label: "Product name",
            value: 'name'
          },
        ]
      },
      sort_product_sorting: {
        title: "SORTING",
        data: [
          {
            label: "Increment",
            value: 'asc'
          },
          {
            label: "Decrement",
            value: 'desc'
          }
        ]
      },
      sort_category_base_on: {
        title: "SORT CATEGORIES BASED ON",
        data: [
          {
            label: "Category Position",
            value: 'position'
          },
          {
            label: "Category Name",
            value: 'name'
          }
        ]
      },
      sort_category_sorting: {
        title: "SORTING",
        data: [
          {
            label: "Increment",
            value: 'asc'
          },
          {
            label: "Decrement",
            value: 'desc'
          }
        ]
      },
      custom_sale_tax_class: {
        title: "Custom sale tax class",
        data: this.taxClassHelper.getProductTaxClass(this.entitiesState.taxClass.items.toArray())['data']
      }
    };
  }
  
  getRetailConfigSnapshot() {
    return this.retailConfigService.retailConfigSnapshot;
  }
}
