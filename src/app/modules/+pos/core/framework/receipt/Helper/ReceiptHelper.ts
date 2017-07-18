import * as _ from 'lodash';

export class ReceiptHelper {
  
  static getReceiptTemplateSelect(receipts: any[], includeAddNew: boolean = false) {
    let selectData = {
      data: []
    };
    
    if (includeAddNew === true) {
      selectData.data.push({label: "Add new receipt", value: "ADD_NEW"});
    }
    
    _.forEach(receipts, (r) => {
      selectData['data'].push({label: r['name'], value: r['id']});
    });
    
    return selectData;
  }
}
