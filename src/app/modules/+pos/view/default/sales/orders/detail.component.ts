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
import {OrderDetailActions} from "../../../R/sales/orders/detail/detail.actions";
import {OfflineService} from "../../../../../share/provider/offline";
import {AppStorage} from "../../../../../../services/storage";
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
  
  constructor(protected authenticateService: AuthenticateService,
              public orderService: OrderService,
              protected quoteActions: PosQuoteActions,
              protected routerActions: RouterActions,
              protected authService: AuthenticateService,
              protected storage: AppStorage,
              private notify: NotifyManager,
              private offline: OfflineService,
              private detailActions: OrderDetailActions,
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
      if (parseInt(p['is_purchase']) === 1 || p['is_purchase'] === true) {
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
    if (this.authenticateService.userCan('duplicate_order')) {
      this.routerActions.go('pos/default/sales/checkout');
      setTimeout(() => {
        this.quoteActions.reorder({customer: parseInt(this.getOrder()['customer']['id']), items: this.getOrder()['items']});
      }, 250);
    }else{
      this.notify.error("not_have_permission_to_duplicate_order");
    }
  }
  
  printReceipt(type: string = 'receipt') {
    if (this.authService.userCan('print_order_detail')) {
      this.receiptActions.printSalesReceipt(this.getOrder(), type);
    }else{
      this.notify.error("not_have_permission_to_print_order_detail");
    }
  }
  
  addPayments() {
    if (this.authService.userCan('add_payment')) {
      this.addPaymentActions.needAddPayment(this.getOrder());
    } else {
      this.notify.error("not_have_permission_to_add_payment_for_order");
    }
  }
  
  refund() {
    if (!this.offline.online) {
      this.notify.warning("sorry_you_can_not_perform_this_action_in_offline");
      return;
    }
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
      this.notify.error("you_do_not_have_permission_to_perform_this_action");
    }
  }
  
  markAsReSynnc() {
    if (!this.getOrder()['id']) {
      delete this.getOrder()['id'];
    }
    this.detailActions.markAsReSync(this.getOrder());
  }
  
  ship() {
    if (!this.offline.online) {
      this.notify.warning("sorry_you_can_not_perform_this_action_in_offline");
      return;
    }
    this.detailActions.shipOrder(this.getOrder());
  }
  
  sendEmailReceipt() {
    if (this.offline.online) {
      const email = this.getOrder()['customer']['email'];
      let re      = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(email) === false) {
        return this.notify.warning("email_not_valid");
      }
      let name = this.getOrder()['customer']['name'];
      let settingReceipt = {
        receiptSetting: this.configState.receipt,
        //username: this.userCollection.getUserNameById(this.getOrder()['user_id']),
        username: this.storage.localRetrieve("user")['username'],
        inclDiscountPerItemInDiscount: this.configState.posRetailConfig.inclDiscountPerItemInDiscount
      };
      this.receiptActions.sendEmailReceipt(this.getOrder(), email, name, settingReceipt);
    } else {
      this.notify.warning("sorry_you_can_not_send_email_in_offline");
    }
  }
  
  checkoutAsGuest(): boolean {
    if (this.getOrder().hasOwnProperty('customer')) {
      return parseInt(this.getOrder()['customer']['id']) === parseInt(this.configState.setting.customer.getDefaultCustomerId());
    } else {
      return false;
    }
  }
}
