import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosConfigState} from "../../../../../R/config/config.state";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-orders-detail-items',
             templateUrl: 'items.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersDetailItemsComponent implements OnInit {
  @Input() item: Object;
  @Input() configState: PosConfigState;
  protected _data = {};
  
  constructor() { }
  
  ngOnInit() { }
  
  getBundleChildren() {
    if (!this._data.hasOwnProperty('bundle_children') && this.item['children']) {
      this._data['bundle_children'] = [];
      let _group                    = {};
      _.forEach(this.item['children'], (item) => {
        if (!item['product_options'].hasOwnProperty('option_id'))
          return true;
        let _optionId = item['product_options']['option_id'];
        if (!_group.hasOwnProperty(_optionId)) {
          _group[_optionId] = {
            'label': item['product_options']['option_label'],
            'items': []
          };
        }
        _group[_optionId]['items'].push(item);
        
      });
      _.forEach(_group, g => this._data['bundle_children'].push(g));
    }
    return this._data['bundle_children'];
  }
  
  isHaveOption() {
    if (!this._data.hasOwnProperty('is_have_options')) {
      this._data['is_have_options'] =
        (this.item['product_options'].hasOwnProperty('options') && _.size(this.item['product_options']['options']) > 0) ||
        _.size(this.item['children']) > 0;
    }
    return this._data['is_have_options'];
  }
  
  checkDecimalsQtyItems() {
    return !Number.isInteger(this.item['qty_ordered'] || 0);
  }
}
