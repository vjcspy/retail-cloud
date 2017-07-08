import * as _ from 'lodash';

export class TaxClassHelper {
  protected _elementData = {};
  static taxClass;
  
  getProductTaxClassElementData() {
    if (!this._elementData.hasOwnProperty('tax_class')) {
      this._elementData['tax_class'] = {
        data: [
          {
            value: '0',
            label: "None"
          }
        ]
      };
      _.forEach(TaxClassHelper.taxClass, (taxClass) => {
        if (taxClass['type'] === "PRODUCT") {
          this._elementData['tax_class']['data']
            .push({
                    value: taxClass['id'],
                    label: taxClass['name']
                  });
        }
      });
    }
    return this._elementData['tax_class'];
  }
}
