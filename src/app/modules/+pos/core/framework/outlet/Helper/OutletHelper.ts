import * as _ from 'lodash';

export class OutletHelper {
  private static _outlet      = [];
  private static _elementData = {};
  
  static get outlets() {
    return this._outlet;
  }
  
  static set outlets(value) {
    OutletHelper._elementData = {};
    this._outlet             = value;
  }
  
  static getOutletElementData() {
    if (!OutletHelper._elementData.hasOwnProperty('outlet')) {
      OutletHelper._elementData['outlet'] = {
        data: []
      };
      // StoreHelper._elementData['store']['data'].push({
      //                                                  label: "Choose your option",
      //                                                  value: 'AllStore'
      //                                                });
      _.forEach(OutletHelper._outlet, (outlet) => {
        if (outlet['id' ] !== "0") {
          OutletHelper._elementData['outlet']['data'].push({
                                                           label: outlet['name'],
                                                           value: outlet['id']
                                                         });
        }
      });
    }

    return OutletHelper._elementData['outlet'];
  }
  
  static getOutletById(outletId) {
    let _outlet = _.find(OutletHelper._outlet, (outlet) => parseInt(outlet['id']) === parseInt(outletId));
    return _outlet ? _outlet['name'] : null;
  }
}
