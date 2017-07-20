import * as _ from 'lodash';

export class CustomerHelper {
  
  static getCustomerGroupSelectElem(groups: any[]) {
    let select = {
      data: []
    };
    _.forEach(groups, (group) => {
      if (parseInt(group['id']) === 0) {
        return true;
      }
      select.data.push({
                         value: group['id'],
                         label: group['code']
                       });
    });
    
    return select;
  }
}
