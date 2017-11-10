import {Injectable} from '@angular/core';
import {AbstractCollection} from "../../../code/meteor/AbstractCollection";

@Injectable()
export class PlanCollection extends AbstractCollection {
  protected $collection: string = "sales_plan";
}
