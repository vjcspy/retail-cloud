import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {Store} from "@ngrx/store";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {Observable} from "rxjs/Observable";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-refund-items',
             templateUrl: 'refund-items.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class PosDefaultSalesCheckoutCartRefundItemsComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input() configState: PosConfigState;

  public entitiesState$: Observable<PosEntitiesState>;

  constructor(protected store$: Store<any>) {
    this.entitiesState$ = this.store$.select('entities');
  }

}
