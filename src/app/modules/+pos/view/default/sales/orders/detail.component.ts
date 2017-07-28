import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {OrderService} from "../../../R/sales/orders/order.service";
import {PosConfigState} from "../../../../R/config/config.state";
import {OrdersState} from "../../../R/sales/orders/order.state";
import * as _ from 'lodash';
import {CountryHelper} from "../../../../core/framework/directory/Helper/CountryHelper";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {ReceiptActions} from "../../../R/sales/receipts/receipt.actions";
import {OrderListAddPaymentActions} from "../../../R/sales/checkout/step/order-list-add-payment/add-payment.actions";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {QuoteRefundActions} from "../../../../R/quote/refund/refund.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-order-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersDetailComponent {
  protected _data = {
    totalPaid: {}, // cache total paid of order
    countryName: {}
  };
  
  @Input() configState: PosConfigState;
  @Input() ordersState: OrdersState;
  
  constructor(public orderService: OrderService,
              protected quoteActions: PosQuoteActions,
              protected routerActions: RouterActions,
              protected authService: AuthenticateService,
              private notify: NotifyManager,
              protected receiptActions: ReceiptActions,
              protected refundActions: QuoteRefundActions,
              protected addPaymentActions: OrderListAddPaymentActions) { }
  
  getPayment() {
    let payments = [];
    _.forEach(this.getOrder()['payment'], (payment) => {
      if (_.isObject(payment)) {
        payments.push(payment);
      }
    });
    
    return payments;
  }
  
  getPaymentTitle(payment) {
    return payment['title'] + (payment['data'] && !!payment['data']['ref'] ?
        (": Ref# " + payment['data']['ref']) : "") + (parseInt(payment['is_purchase']) === 0 ? " REFUND" : "");
  }
  
  getOrder() {
    return this.ordersState.detail.order;
  }
  
  getTotalPaidBaseOnPayment() {
    let paid = 0;
    _.forEach(this.getPayment(), (p) => {
      if (parseInt(p['is_purchase']) === 1) {
        paid += parseFloat(p['amount']);
      }
    });
    
    return paid;
  }
  
  getCountryNameFromId(country_id: string) {
    return CountryHelper.getCountryNameFromId(country_id);
  }
  
  getRegionSelectedByCountryId(countryId, regionId) {
    return CountryHelper.getRegionSelected(countryId, regionId);
  }
  
  reorder() {
    this.routerActions.go('pos/default/sales/checkout');
    setTimeout(() => {
      this.quoteActions.reorder({customer: parseInt(this.getOrder()['customer']['id']), items: this.getOrder()['items']});
    }, 250);
  }
  
  printReceipt(type: string = 'receipt') {
    this.receiptActions.printSalesReceipt(this.getOrder(), type);
  }
  
  addPayments() {
    this.addPaymentActions.needAddPayment(this.getOrder());
  }
  
  refund() {
    if (this.authService.userCan('make_refund')) {
      if (this.getOrder()['can_creditmemo'] && this.getOrder()['order_id']) {
        const orderId = parseInt(this.getOrder()['order_id']);
        this.routerActions.go('pos/default/sales/checkout');
        setTimeout(() => {
          this.quoteActions.reorder({customer: parseInt(this.getOrder()['customer']['id']), items: []});
          this.refundActions.loadCreditmemo(orderId);
        }, 250);
      }
    } else {
      this.notify.error("you don't have permission to perform this action");
    }
  }
}
