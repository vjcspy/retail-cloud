import {Component, OnInit} from '@angular/core';
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

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout',
             templateUrl: 'checkout.component.html'
           })
export class PosDefaultSalesCheckoutComponent extends AbstractSubscriptionComponent implements OnInit {
  protected checkoutState$: Observable<CheckoutState>;
  protected entitiesState$: Observable<PosEntitiesState>;
  protected configState$: Observable<PosConfigState>;
  protected quoteState$: Observable<PosQuoteState>;
  protected generalState$: Observable<PosGeneralState>;
  
  constructor(private store$: Store<PosState>, private pullActions: PosPullActions, private router: Router) {
    super();
    
    this.checkoutState$ = this.store$.select('checkout');
    this.entitiesState$ = this.store$.select('entities');
    this.configState$   = this.store$.select('config');
    this.quoteState$    = this.store$.select('quote');
    this.generalState$  = this.store$.select('general');
  }
  
  ngOnInit() {
    this.subscribeObservable('check_general_state', () => this.generalState$.subscribe((generalState: PosGeneralState) => {
      if (!!generalState.register['id'] && !!generalState.outlet['id'] && !!generalState.store['id']) {
        this.pullActions.pullEntities([
                                        'settings',
                                        'countries',
                                        'taxClass',
                                        'taxes',
                                        // 'shifts',
                                        'receipts',
                                        'payment',
                                        'userOrderCount',
                                        // 'warehouse',
                                        // 'permission',
                                        // 'orders',
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
