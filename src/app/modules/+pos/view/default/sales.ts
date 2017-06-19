import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {salesReducer, SalesState} from "../R/index";
import {PosStepState} from "../R/sales/checkout/step/step.state";
import {Bootstrap} from "../../core/framework/bootstrap";
import {Observable} from "rxjs";
import {MenuState} from "../R/sales/menu/menu.state";
import {AbstractSubscriptionComponent} from "../../../../code/AbstractSubscriptionComponent";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales',
             templateUrl: 'sales.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesPage extends AbstractSubscriptionComponent implements OnInit {
  posStepState: PosStepState;
  menuState: MenuState;
  
  constructor(protected store: Store<SalesState>) {
    super();
    this.store.replaceReducer(salesReducer);
    this.subscribeObservable('step', () => this.store.select('step')
                                               .subscribe((posStepState: PosStepState) => {
                                                 this.posStepState = posStepState;
                                               }));
    
    this.subscribeObservable('menu', () => this.store.select('menu')
                                               .subscribe((menuState: MenuState) => {
                                                 this.menuState = menuState;
                                               }));
  }
  
  ngOnInit(): void {
    Bootstrap.run();
  }
}
