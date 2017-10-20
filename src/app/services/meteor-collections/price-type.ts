import {Injectable} from '@angular/core';
import {AbstractCollection} from "../../code/meteor/AbstractCollection";

@Injectable()
export class PriceType extends AbstractCollection {
  protected $collection: string = "price_type";
}
