import {Injectable} from '@angular/core';
import {AbstractCollection} from "../../code/meteor/AbstractCollection";
import * as _ from 'lodash';

@Injectable()
export class UserCollection extends AbstractCollection {
  protected $collection: string = "users";
  protected $collectionExisted  = true;
  
  getUserNameById(id) {
    const cashier = this.getCollection().findOne({_id: id});
    if (cashier) {
      return cashier['username'];
    } else {
      return " Unknown";
    }
  }
  
  getUserSelect() {
    let users       = this.getCollection().find({}).fetch();
    let elementData = {
      data: []
    };
    _.forEach(users, (user) => {
      elementData.data.push({
                              label: user['username'],
                              value: user['_id']
                            });
    });
    
    return elementData;
  }
}
