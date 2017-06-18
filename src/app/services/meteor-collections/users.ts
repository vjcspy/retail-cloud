import {Injectable} from '@angular/core';
import {AbstractCollection} from "../../code/meteor/AbstractCollection";

@Injectable()
export class UserCollection extends AbstractCollection {
  protected $collection: string = "users";
  protected $collectionExisted  = true;
  
  getUserNameById(id) {
    const cashier = this.getCollection().findOne({_id: id});
    if (cashier) {
      return cashier['username'];
    } else
      return " Unknown";
  }
}
