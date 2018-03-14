import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";
import {RetailConfigService} from "../../../../R/retail-config/retail-config.service";
import {RetailConfigState} from "../../../../R/retail-config/retail-config.state";
import {ProductSetting} from "../../../../../../core/framework/setting/ProductSetting";
import {TaxClassHelper} from "../../../../../../core/framework/tax/Helper/TaxClass";
import * as _ from 'lodash';
import {RetailDataHelper} from "../../../../../../services/retail-data-helper";

@Component({
  // moduleId: module.id,
  selector: 'product-category-settings',
  templateUrl: 'settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosConfigurationsDefaultPosProductCategorySettingsComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() retailConfigState: RetailConfigState;

  protected _data = {};

  constructor(public retailConfigService: RetailConfigService) {
  }

  ngOnInit() {
    this.initProductCategoryConfigurationData();
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
            label: "Ascending",
            value: 'asc'
          },
          {
            label: "Descending",
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
            label: "Ascending",
            value: 'asc'
          },
          {
            label: "Descending",
            value: 'desc'
          }
        ]
      },
      custom_sale_tax_class: {
        title: "Custom sale tax class",
        data: TaxClassHelper.getProductTaxClassElementData()['data']
      }
    };

    if (this.getRetailConfigSnapshot()['pos']['xretail/pos/integrate_gc'] === 'aheadWorld') {
      this._data['show_product_by_type']['data'].push({
        label: "Gift card",
        value: _.join(RetailDataHelper.GIFT_CARD_TYPE_ID, ",")
      });
    }
  }

  protected _productAttributes;

  getProductAttributesSelect() {
    if (typeof this._productAttributes === 'undefined') {
      let attributes = ProductSetting.getProductAttributesSelect();
      if (_.size(attributes['data']) > 0) {
        return this._productAttributes = attributes;
      } else {
        this._productAttributes = {
          data: []
        };

        _.forEach(this.getRetailConfigSnapshot()['pos']['productAttributes'], (attr) => {
          this._productAttributes['data']
            .push({
              value: attr['value'],
              label: attr['label']
            });
        });
      }
    }
    return this._productAttributes;
  }

  getRetailConfigSnapshot() {
    return this.retailConfigService.retailConfigSnapshot;
  }
}
