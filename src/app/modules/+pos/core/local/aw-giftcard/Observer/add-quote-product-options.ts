import {ObserverInterface} from "../../../framework/General/Event/ObserverInterface";
import {Event} from "../../../framework/General/Event/Event";
import * as _ from 'lodash';

export class AddQuoteProductOptions extends Event {
  create(): ObserverInterface {
    return new AddQuoteProductOptionsObserver();
  }
}

class AddQuoteProductOptionsObserver implements ObserverInterface {
  execute(observe: any): void {
    let {item, data} = observe;
    let customOption = item.getData('buy_request').getData('gift_card');
    
    if (customOption) {
      if (!data.hasOwnProperty('options')) {
        data['options'] = [];
      }
      _.forEach(customOption, (value, label) => {
        data['options'].push({label, value});
      });
      
    }
  }
}
