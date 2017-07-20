import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {FormControl} from "@angular/forms";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-top-bar',
             templateUrl: 'top-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutTopBarComponent extends AbstractSubscriptionComponent implements AfterViewInit {
  @Input() checkoutProductState: CheckoutProductState;
  @Input() configState: PosConfigState;
  protected searchString = new FormControl();
  
  constructor(private checkoutProductActions: CheckoutProductActions, public menuLeftActions: MenuLeftActions) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.subscribeObservable('subscribe_input_search', () => this.searchString
                                                                 .valueChanges
                                                                 .debounceTime(this.configState.constrain['debounceTimeSearch'])
                                                                 .distinctUntilChanged()
                                                                 .subscribe((searchString: string) => this.checkoutProductActions.updateGridState({
                                                                                                                                                    searchString,
                                                                                                                                                    lastLuckySearchString: null
                                                                                                                                                  }))
    );
  }
}
