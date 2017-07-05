import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ShiftState} from "../../../R/sales/shifts/shift.state";
import * as _ from 'lodash';
import {PosEntitiesState} from "../../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftDetailComponent implements OnInit, OnChanges {
  
  
  @Input() shiftState: ShiftState;
  @Input() entitiesState: PosEntitiesState;
  
  constructor() { }
  
  ngOnInit() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    _.forEach(changes, (v, k) => {
      if (k === 'shiftState') {
        this.initShiftData();
      }
    });
  }
  
  protected trackById(index, shift) {
    return shift['id'];
  }
  
  initShiftData() {
    if (this.shiftState.detail.shift && !this.shiftState.detail.shift.hasOwnProperty('_data')) {
      this.shiftState.detail.shift['_data'] = {sales: {}, refund: {}, totals: {}};
    }
  }
  
  shiftIsOpening() {
    return parseInt(this.shiftState.detail.shift['is_open']) === 1;
  }
  
  getSaleTransaction(paymentId) {
    if (!this.shiftState.detail.shift._data.sales.hasOwnProperty(paymentId)) {
      this.shiftState.detail.shift._data.sales[paymentId] = 0;
      _.forEach(this.shiftState.detail.shift['transactions'], (payment) => {
        if (payment['payment_id'] == paymentId && parseInt(payment['is_purchase']) === 1) {
          this.shiftState.detail.shift._data.sales[paymentId] += parseFloat(payment['amount']);
        }
      })
    }
    return this.shiftState.detail.shift._data.sales[paymentId];
  }
  
  getRefundTransaction(paymentId) {
    if (!this.shiftState.detail.shift._data.refund.hasOwnProperty(paymentId)) {
      this.shiftState.detail.shift._data.refund[paymentId] = 0;
      _.forEach(this.shiftState.detail.shift['transactions'], (payment) => {
        if (payment['payment_id'] == paymentId && parseInt(payment['is_purchase']) === 0)
          this.shiftState.detail.shift._data.refund[paymentId] += parseFloat(payment['amount']);
      })
    }
    return this.shiftState.detail.shift._data.refund[paymentId];
  }
  
  getNetTransaction(paymentId) {
    let sales  = 0;
    let refund = 0;
    if (this.shiftState.detail.shift._data.sales.hasOwnProperty(paymentId))
      sales = this.shiftState.detail.shift._data.sales[paymentId];
    if (this.shiftState.detail.shift._data.refund.hasOwnProperty(paymentId))
      refund = this.shiftState.detail.shift._data.refund[paymentId];
    return sales + refund;
  }
  
  
  getTotalsSales() {
    if (!this.shiftState.detail.shift._data.totals.hasOwnProperty('sales')) {
      this.shiftState.detail.shift._data.totals['sales'] = 0;
      _.forEach(this.shiftState.detail.shift._data.sales, sale => {this.shiftState.detail.shift._data.totals['sales'] += parseFloat(<any>sale)});
    }
    return this.shiftState.detail.shift._data.totals['sales'];
  }
  
  getTotalsRefund() {
    if (!this.shiftState.detail.shift._data.totals.hasOwnProperty('refund')) {
      this.shiftState.detail.shift._data.totals['refund'] = 0;
      _.forEach(this.shiftState.detail.shift._data.refund, sale => this.shiftState.detail.shift._data.totals['refund'] += parseFloat(<any>sale));
    }
    return this.shiftState.detail.shift._data.totals['refund'];
  }
  
  getTotalInOut() {
    if (!this.shiftState.detail.shift._data.totals.hasOwnProperty('inOut')) {
      this.shiftState.detail.shift._data.totals['inOut'] = 0;
      _.forEach(this.shiftState.detail.shift['in_out'], (inOut) => {
        if (inOut['is_in'] == 1) {
          this.shiftState.detail.shift._data.totals['inOut'] += parseFloat(inOut['amount']);
        } else {
          this.shiftState.detail.shift._data.totals['inOut'] -= parseFloat(inOut['amount']);
        }
      });
    }
    return this.shiftState.detail.shift._data.totals['inOut'];
  }
  
  getCountedPayment(payment) {
    if (this.shiftState.detail.shift['data']['counted'].hasOwnProperty(payment['id']))
      return this.shiftState.detail.shift['data']['counted'][payment['id']];
    return 0;
  }
  
  getTotalsCountedAllPayment() {
    if (!this.shiftState.detail.shift._data.totals.hasOwnProperty('counted_all_payment')) {
      this.shiftState.detail.shift._data.totals['counted_all_payment'] = 0;
      this.entitiesState.payment.items.forEach((payment) => {
        if (this.shiftState.detail.shift['data']['counted'].hasOwnProperty(payment['id']))
          this.shiftState.detail.shift._data.totals['counted_all_payment'] += parseFloat(this.shiftState.detail.shift['data']['counted'][payment['id']]);
      });
    }
    return this.shiftState.detail.shift._data.totals['counted_all_payment'];
  }
}
