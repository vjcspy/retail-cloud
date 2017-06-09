import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosPullActions} from "../../../R/entities/pull.actions";
import {CheckoutState} from "../../R/sales/checkout.state";
import {Observable} from "rxjs";
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosConfigState} from "../../../R/config/config.state";
import {PosQuoteState} from "../../../R/quote/quote.state";
import {PosGeneralState} from "../../../R/general/general.state";
import {PosState} from "../../../R/index";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {Router} from "@angular/router";
import {CheckoutProductState} from "../../R/sales/checkout/product/product.state";
import {ProductOptionsState} from "../../R/sales/checkout/popup/product-options.state";
import {CartActionBarState} from "../../R/sales/checkout/cart/action-bar.state";
import {CartCustomerState} from "../../R/sales/checkout/cart/customer.state";
import {CartItemState} from "../../R/sales/checkout/cart/item.state";
import {CartTotalsState} from "../../R/sales/checkout/cart/totals.state";

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
  
  checkoutProductState$: Observable<CheckoutProductState>;
  productOptionsState$: Observable<ProductOptionsState>;
  actionBarState$: Observable<CartActionBarState>;
  cartCustomerState$: Observable<CartCustomerState>;
  cartItemState$: Observable<CartItemState>;
  cartTotalsState$: Observable<CartTotalsState>
  
  constructor(private store$: Store<PosState>, private pullActions: PosPullActions, private router: Router) {
    super();
    
    this.entitiesState$ = this.store$.select('entities');
    this.configState$   = this.store$.select('config');
    this.quoteState$    = this.store$.select('quote');
    this.generalState$  = this.store$.select('general');
    
    this.checkoutProductState$ = this.store$.select('checkoutProduct');
    this.productOptionsState$  = this.store$.select('productOptions');
    this.actionBarState$       = this.store$.select('cartActionBar');
    this.cartCustomerState$    = this.store$.select('cartCustomer');
    this.cartItemState$        = this.store$.select('cartItem');
    this.cartTotalsState$      = this.store$.select('cartTotals');
  }
  
  ngOnInit() {
    this.subscribeObservable('check_general_state', () => this.generalState$.subscribe((generalState: PosGeneralState) => {
      if (!!generalState.register['id'] && !!generalState.outlet['id'] && !!generalState.store['id']) {
        this.pullActions.pullEntities([
                                        'settings',
                                        'countries',
                                        'taxClass',
                                        'taxes',
                                        'receipts',
                                        'payment',
                                        'userOrderCount',
                                        // 'warehouse',
                                        // 'permission',
                                        'customerGroup',
                                        'customers',
                                        // 'category',
                                        'products'
                                      ]);
      } else {
        this.router.navigate(['pos/default/sales/outlet-register']);
      }
    }));
    
  }
  
}
