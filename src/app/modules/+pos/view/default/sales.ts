import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {posSalesReducer} from "../R/index";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales',
             templateUrl: 'sales.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesPage {
  constructor(protected store: Store<any>) {
    this.store.replaceReducer(posSalesReducer);
  }
}
