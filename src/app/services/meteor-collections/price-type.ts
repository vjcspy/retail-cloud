import {Injectable} from '@angular/core';
import {AbstractCollection} from "../../code/meteor/AbstractCollection";

@Injectable()
export class PriceTypeCollection extends AbstractCollection {
  protected $collection: string = "price_type";
}
