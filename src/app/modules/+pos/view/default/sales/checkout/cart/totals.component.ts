import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {CartTotalsState} from "../../../../R/sales/checkout/cart/totals.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import {CartTotalsActions} from "../../../../R/sales/checkout/cart/totals.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-totals',
             templateUrl: 'totals.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartTotalsComponent implements OnInit {
  @Input() quoteState: PosQuoteState;
  @Input() configState: PosConfigState;
  @Input() cartTotalsState: CartTotalsState;
  
  constructor(protected cartTotalsActions: CartTotalsActions) { }
  
  ngOnInit() { }
  
  protected getAppliedTaxes() {
    let appliedTaxes = this.quoteState.quote.getShippingAddress().getData('applied_taxes');
    let _result      = [];
    if (appliedTaxes) {
      _.forEach(appliedTaxes, (tax) => {
        _result.push({id: tax['id'], percent: NumberHelper.round(tax['percent'], 4), amount: tax['amount']});
      });
    }
    return _result;
  }
}
