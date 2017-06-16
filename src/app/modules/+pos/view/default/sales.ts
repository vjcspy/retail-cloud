import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {salesReducer, SalesState} from "../R/index";
import {PosStepState} from "../R/sales/checkout/step/step.state";
import {Bootstrap} from "../../core/framework/bootstrap";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales',
             templateUrl: 'sales.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesPage implements OnInit {
  posStepState: PosStepState;
  
  constructor(protected store: Store<SalesState>) {
    this.store.replaceReducer(salesReducer);
    this.store.select('step').subscribe((posStepState: PosStepState) => {
      this.posStepState = posStepState;
    });
  }
  
  ngOnInit(): void {
    Bootstrap.run();
  }
}
