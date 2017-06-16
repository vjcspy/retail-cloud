import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Observable} from "rxjs";
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosConfigState} from "../../../R/config/config.state";
import {PosQuoteState} from "../../../R/quote/quote.state";
import {PosGeneralState} from "../../../R/general/general.state";
import {CheckoutProductState} from "../../R/sales/checkout/product/product.state";
import {ProductOptionsState} from "../../R/sales/checkout/popup/product-options.state";
import {CartActionBarState} from "../../R/sales/checkout/cart/action-bar.state";
import {CartCustomerState} from "../../R/sales/checkout/cart/customer.state";
import {CartItemState} from "../../R/sales/checkout/cart/item.state";
import {CartTotalsState} from "../../R/sales/checkout/cart/totals.state";
import {PosState} from "../../../R/index";
import {PosPullActions} from "../../../R/entities/pull.actions";
import {Router} from "@angular/router";
import {PosSyncState} from "../../../R/sync/sync.state";
import {PosStepState} from "../../R/sales/checkout/step/step.state";
import {PosSyncActions} from "../../../R/sync/sync.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout',
             templateUrl: 'checkout.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutComponent extends AbstractSubscriptionComponent implements OnInit {
  entitiesState$: Observable<PosEntitiesState>;
  configState$: Observable<PosConfigState>;
  quoteState$: Observable<PosQuoteState>;
  generalState$: Observable<PosGeneralState>;
  posSyncState$: Observable<PosSyncState>;
  
  checkoutProductState$: Observable<CheckoutProductState>;
  productOptionsState$: Observable<ProductOptionsState>;
  cartActionBarState$: Observable<CartActionBarState>;
  cartCustomerState$: Observable<CartCustomerState>;
  cartItemState$: Observable<CartItemState>;
  cartTotalsState$: Observable<CartTotalsState>;
  posStepState$: Observable<PosStepState>;
  
  constructor(private store$: Store<PosState>, private pullActions: PosPullActions, private router: Router, private syncActions: PosSyncActions) {
    super();
    
    this.entitiesState$ = this.store$.select('entities');
    this.configState$   = this.store$.select('config');
    this.quoteState$    = this.store$.select('quote');
    this.generalState$  = this.store$.select('general');
    this.posSyncState$  = this.store$.select('sync');
    
    this.checkoutProductState$ = this.store$.select('checkoutProduct');
    this.productOptionsState$  = this.store$.select('productOptions');
    this.cartActionBarState$   = this.store$.select('cartActionBar');
    this.cartCustomerState$    = this.store$.select('cartCustomer');
    this.cartItemState$        = this.store$.select('cartItem');
    this.cartTotalsState$      = this.store$.select('cartTotals');
    this.posStepState$         = this.store$.select('step');
  }
  
  ngOnInit() {
    this.syncActions.autoSyncOfflineOrder();
  }
  
}
