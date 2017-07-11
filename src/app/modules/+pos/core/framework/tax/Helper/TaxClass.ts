import * as _ from 'lodash';

export class TaxClassHelper {
  static _elementData = {};
  private static _taxClass;
  
  static get taxClass() {
    return this._taxClass;
  }
  
  static set taxClass(value) {
    TaxClassHelper._elementData = {};
    this._taxClass              = value;
  }
  
  static getProductTaxClassElementData() {
    if (!TaxClassHelper._elementData.hasOwnProperty('tax_class')) {
      TaxClassHelper._elementData['tax_class'] = {
        data: [
          {
            value: '0',
            label: "None"
          }
        ]
      };
      _.forEach(TaxClassHelper._taxClass, (taxClass) => {
        if (taxClass['type'] === "PRODUCT") {
          TaxClassHelper._elementData['tax_class']['data']
            .push({
                    value: taxClass['id'],
                    label: taxClass['name']
                  });
        }
      });
    }
    return TaxClassHelper._elementData['tax_class'];
  }
}
