import {AfterViewInit, ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CheckoutState} from "../../../R/sales/checkout.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {FormControl} from "@angular/forms";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {PosCheckoutActions} from "../../../R/sales/checkout.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-top-bar',
             templateUrl: 'top-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutTopBarComponent extends AbstractSubscriptionComponent implements AfterViewInit {
  @Input() checkoutState: CheckoutState;
  @Input() configState: PosConfigState;
  protected searchString = new FormControl();
  
  constructor(private checkoutActions: PosCheckoutActions) {
    super();
  }
  
  ngAfterViewInit(): void {
    this.subscribeObservable('subscribe_input_search', () => this.searchString
                                                                 .valueChanges
                                                                 .debounceTime(this.configState.constrain['debounceTimeSearch'])
                                                                 .distinctUntilChanged()
                                                                 .subscribe((searchString: string) => this.checkoutActions.updateGridState({searchString}))
    );
  }
}
