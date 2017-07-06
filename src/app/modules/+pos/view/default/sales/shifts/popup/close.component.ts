import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ShiftState} from "../../../../R/sales/shifts/shift.state";
import {PosGeneralState} from "../../../../../R/general/general.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {AuthenticateService} from "../../../../../../../services/authenticate";
import {ShiftDetailActions} from "../../../../R/sales/shifts/detail/detail.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-popup-close',
             templateUrl: 'close.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsPopupCloseComponent implements OnInit {
  @Input() shiftState: ShiftState;
  @Input() generalState: PosGeneralState;
  @Input() entitiesState: PosEntitiesState;
  
  protected _data;
  
  constructor(private authenticate: AuthenticateService,
              protected shiftDetailActions: ShiftDetailActions,
              private notify: NotifyManager) { }
  
  ngOnInit() {
    this.setDefaultData();
  }
  
  getOutletRegisterData() {
    if (this.generalState.register && this.generalState.outlet) {
      return this.generalState.register['name'] + ' - ' + this.generalState.outlet['name'];
    }
  }
  
  setDefaultData() {
    this._data = {
      expected: {},
      counted: {},
      diff: {},
      note: "",
      takeOut: 0,
      cashExpected: 0
    };
  }
  
  getExpectedAmount(payment) {
    if (!this._data.expected.hasOwnProperty(payment['id'])) {
      this._data.expected[payment['id']] = 0;
      _.forEach(this.shiftState.detail.shift['transactions'], (tran) => {
        if (tran['payment_id'] == payment['id']) {
          if (tran['is_purchase'] == 1) {
            this._data.expected[payment['id']] += parseFloat(tran['amount']);
          } else {
            this._data.expected[payment['id']] += parseFloat(tran['amount']);//refund amount is negative
          }
        }
      });
      if (payment['type'] == 'cash') {
        _.forEach(this.shiftState.detail.shift['in_out'], (inOut) => {
          if (inOut['is_in'] == 1) {
            this._data.expected[payment['id']] += parseFloat(inOut['amount']);
          } else {
            this._data.expected[payment['id']] -= parseFloat(inOut['amount']);
          }
        });
        this._data.expected[payment['id']] += parseFloat(this.shiftState.detail.shift['start_amount']);
      }
    }
    return this._data.expected[payment['id']];
  }
  
  getDiff(payment, force: boolean = false) {
    if (!this._data.diff.hasOwnProperty(payment['id']) || force) {
      this._data.diff[payment['id']] =
        -((isNaN(this._data.expected[payment['id']]) ?
          0 :
          parseFloat(this._data.expected[payment['id']])) -
          parseFloat(this._data.counted[payment['id']]));
    }
    return this._data.diff[payment['id']];
  }
  
  closeShift() {
    if (this.authenticate.userCan('open_and_close_register')) {
      this.shiftDetailActions.closeShift(this.shiftState.detail.shift);
    } else {
      this.notify.warning("not_have_permession_to_close_shift");
    }
  }
  
  protected getUserName() {
    return this.authenticate.getUserName();
  }
}
