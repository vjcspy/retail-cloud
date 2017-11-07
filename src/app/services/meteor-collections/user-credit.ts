import {AbstractCollection} from "../../code/meteor/AbstractCollection";
import {Injectable} from "@angular/core";

@Injectable()
export class UserCreditCollection extends AbstractCollection {
  $collection: string = 'user_credit';
  
}
