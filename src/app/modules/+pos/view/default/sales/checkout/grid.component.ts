import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {SalesState} from "../../../R/sales/sales.state";
import {Observable} from "rxjs";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {ProductHelper} from "../../../../services/helper/product";
import {CheckoutState} from "../../../R/sales/checkout.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grid',
             templateUrl: 'grid.component.html'
           })
export class PosDefaultSalesCheckoutGridComponent implements OnInit {
  protected checkoutState: CheckoutState;
  protected entitiesState: PosEntitiesState;
  
  constructor(private store$: Store<any>, protected productHelper: ProductHelper) {}
  
  ngOnInit() {
    this.store$.select("checkout").subscribe((checkoutState: CheckoutState) => this.checkoutState = checkoutState);
    this.store$.select("entities").subscribe((entitiesState: PosEntitiesState) => this.entitiesState = entitiesState);
  }
  
  protected onResize() {
  
  }
  
  protected trackByItemFn(index, product) {
    return product['id'];
  }
}
