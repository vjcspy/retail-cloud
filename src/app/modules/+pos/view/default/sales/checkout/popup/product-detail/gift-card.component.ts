import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ProductOptionsState} from "../../../../../R/sales/checkout/popup/product-options.state";
import {PriceFormatPipe} from "../../../../../pipes/price-format";
import * as _ from 'lodash';
import * as moment from 'moment';
import {ProductOptionsActions} from "../../../../../R/sales/checkout/popup/product-options.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail-gift-card',
             templateUrl: 'gift-card.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupProductDetailGiftCardComponent implements OnInit {
  @Input() productOptionsState: ProductOptionsState;
  
  data = {
    minDate: moment(),
    selectElem: {
      amount: {
        data: []
      },
      delivery_date_timezone: {
        data: []
      },
      templates: {
        data: []
      }
    },
  };
  
  giftCardOption = {
    aw_gc_delivery_date: {},
  };
  
  protected priceFormatPipe = new PriceFormatPipe();
  
  constructor(protected productOptionsActions: ProductOptionsActions) { }
  
  ngOnInit() {
    this.initViewData();
    this.giftCardOption = Object.assign({
                                          aw_gc_delivery_date: {}
                                        }, this.productOptionsState.optionData.gift_card);
  }
  
  getGiftCardOptionConfig() {
    return this.productOptionsState.product.x_options['gift_card'];
  }
  
  updateGiftCardOption(key, value) {
    this.giftCardOption[key] = value;
    
    if (!_.isEmpty(this.giftCardOption)) {
      this.productOptionsActions.updateProductOptionData('gift_card', this.giftCardOption);
    }
  }
  
  protected initViewData() {
    const amountOption = this.getGiftCardOptionConfig()['getAmountOptions'];
    if (_.isArray(amountOption)) {
      _.forEach(amountOption, (o) => {
        this.data.selectElem.amount.data.push(
          {
            label: this.priceFormatPipe.transform(o),
            value: o
          }
        );
      });
    }
    
    if (this.getGiftCardOptionConfig()['isAllowOpenAmount']) {
      this.data.selectElem.amount.data.push({
                                              label: 'Custom amount',
                                              value: 'custom'
                                            });
    }
    
    const templates = this.getGiftCardOptionConfig()['getGiftcardTemplates'];
    if (_.isArray(templates)) {
      this.data.selectElem.templates.data.push(..._.map(templates, (t) => {
        return {
          label: t['name'],
          value: t['value']
        };
      }));
    }
    
    this.data.selectElem.delivery_date_timezone.data.push(..._.map(this.getGiftCardOptionConfig()['getTimezones'], (_tz) => _tz));
  }
}
