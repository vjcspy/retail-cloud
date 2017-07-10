import * as _ from 'lodash';

export class StoreHelper {
  private static _stores      = [];
  private static _elementData = {};
  
  static get stores() {
    return this._stores;
  }
  
  static set stores(value) {
    StoreHelper._elementData = {};
    this._stores             = value;
  }
  
  static getStoreElementData() {
    if (!StoreHelper._elementData.hasOwnProperty('store')) {
      StoreHelper._elementData['store'] = {
        data: []
      };
      StoreHelper._elementData['store']['data'].push({
                                                       label: "Choose your option",
                                                       value: 'AllStore'
                                                     });
      _.forEach(StoreHelper._stores, (store) => {
        StoreHelper._elementData['store']['data'].push({
                                                         label: store['name'],
                                                         value: store['id']
                                                       });
      });
    }
    return StoreHelper._elementData['store'];
  }
}
