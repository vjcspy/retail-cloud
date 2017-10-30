import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Product} from "../../../../../../core/framework/catalog/Model/Product";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";
import {PriceFormatPipe} from "../../../../../pipes/price-format";
import * as _ from 'lodash';
import {ProductOptionsState} from "../../../../../R/sales/checkout/popup/product-options.state";
import {ProductOptionsActions} from "../../../../../R/sales/checkout/popup/product-options.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail-customizable-options',
             templateUrl: 'customizable-options.component.html',
             // changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailCustomizableOptionsComponent implements OnInit {
  @Input() option: Object;
  @Input() productOptionsState: ProductOptionsState;
  
  private _options = {};
  
  private _selectData;
  
  constructor(private productOptionsActions: ProductOptionsActions) {
  
  }
  
  get options(): {} {
    return this._options;
  }
  
  set options(value: {}) {
    this._options = value;
  }
  
  ngOnInit() {
    this.options = Object.assign({}, this.productOptionsState.optionData.options);
    
    if (this.option['type'] == "date" || this.option['type'] == "date_time" || this.option['type'] == "time") {
      if (!this.options[this.option['option_id']]) {
        this.options[this.option['option_id']] = {};
        if (this.option['type'] == "date" || this.option['type'] == "date_time") {
          this.options[this.option['option_id']]['data_date'] = null;
        } else if (this.option['type'] == "time" || this.option['type'] == "date_time") {
          this.options[this.option['option_id']]['data_time'] = null;
        }
      } else {
        // FIx xrt-1022 : khi add custom option có date time từ trên mangeto
        if (this.option['type'] == "date" || this.option['type'] == "date_time") {
          let month = this.options[this.option['option_id']]['month'];
          let day   = this.options[this.option['option_id']]['day'];
          let year  = this.options[this.option['option_id']]['year'];
          
          if (!this.options[this.option['option_id']].hasOwnProperty('data_date')) {
            this.options[this.option['option_id']]['data_date'] = moment().year(year).month(month - 1).date(day).format("MM/DD/YYYY");
          }
        }
        if (this.option['type'] == "time" || this.option['type'] == "date_time") {
          let hour     = this.options[this.option['option_id']]['hour'];
          let minute   = this.options[this.option['option_id']]['minute'];
          let day_part = this.options[this.option['option_id']]['day_part'];
          if (day_part == "pm") {
            hour = parseFloat(hour) + 12;
          }
          if (!this.options[this.option['option_id']].hasOwnProperty('data_time')) {
            this.options[this.option['option_id']]['data_time'] = moment().hour(hour).minute(minute).format();
          }
        }
      }
    }
    
    this.updateProductCustomizableOptions();
  }
  
  updateProductCustomizableOptions(k: string = null, v: any = null) {
    if (!!k) {
      this.options[k] = v;
    }
    if (!_.isEmpty(this.options)) {
      this.productOptionsActions.updateProductOptionData('options', this.options);
    }
  }
  
  getProduct(): Product {
    return this.productOptionsState.product;
  }
  
  getOptionTypeData() {
    if (typeof this._selectData == "undefined") {
      this._selectData = {
        data: []
      };
      
      if (_.indexOf(['multiple', 'checkbox'], this.option['type']) > -1) {
        this._selectData['isMultiSelect'] = true;
      } else if (_.indexOf(['radio', 'drop_down'], this.option['type']) > -1)
        this._selectData['isMultiSelect'] = false;
      else
        throw new GeneralException("Option not belong to select pos");
      
      // Thêm cái này để user có thể không chọn option nào
      if (!this._selectData['isMultiSelect'])
        this._selectData = {
          data: [
            {
              value: "",
              label: "Choose an Option",
            }
          ]
        };
      let priceFormat = new PriceFormatPipe();
      if (_.isArray(this.option['data'])) {
        _.forEach(this.option['data'], (optionType: Object) => {
          this._selectData.data.push({
                                       value: optionType['option_type_id'],
                                       label: optionType['title'] + " + " +
                                              (optionType['price_type'] ==
                                               'percent' ?
                                                parseFloat(optionType['price']).toFixed(2) :
                                                priceFormat.transform(optionType['price']))
                                              + (optionType['price_type'] == 'percent' ? "%" : "")
                                     });
        });
      }
    }
    return this._selectData;
  }
}
