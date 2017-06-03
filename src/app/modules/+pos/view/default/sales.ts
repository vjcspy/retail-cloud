import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {posSalesReducer} from "../R/index";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales',
             templateUrl: 'sales.html'
           })
export class PosDefaultSalesPage {
  constructor(protected store: Store<any>) {
    this.store.replaceReducer(posSalesReducer);
  }
}
