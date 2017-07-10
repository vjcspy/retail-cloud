import * as _ from 'lodash';

export class ReceiptHelper {
  
  static getReceiptTemplateSelect(receipts: any[]) {
    let selectData = {
      data: []
    };
    
    _.forEach(receipts, (r) => {
      selectData['data'].push({label: r['name'], value: r['id']});
    });
    
    return selectData;
  }
}
