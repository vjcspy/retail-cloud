import * as _ from 'lodash';

export class ProductSetting {
  private static _selectElement = {};
  private static _config;
  
  static set config(value) {
    ProductSetting._selectElement = {};
    ProductSetting._config        = value;
  }
  
  static getProductAttributes() {
    if (typeof ProductSetting._config !== 'undefined') {
      return ProductSetting._config['product_attributes'];
    } else {
      return [];
    }
  }
  
  static getProductAttributesSelect() {
    if (!ProductSetting._selectElement.hasOwnProperty('country')) {
      ProductSetting._selectElement['productAttributes'] = {
        data: []
      };
      
      _.forEach(ProductSetting.getProductAttributes(), (attr) => {
        this._selectElement['productAttributes']['data']
          .push({
                  value: attr['value'],
                  label: attr['label']
                });
      });
    }
    return this._selectElement['productAttributes'];
  }
}
