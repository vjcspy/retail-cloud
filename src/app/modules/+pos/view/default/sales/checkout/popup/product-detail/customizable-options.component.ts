import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {CheckoutState} from "../../../../../R/sales/checkout.state";
import {Product} from "../../../../../../core/framework/catalog/Model/Product";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";
import {PriceFormatPipe} from "../../../../../../pipes/price-format";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail-customizable-options',
             templateUrl: 'customizable-options.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailCustomizableOptionsComponent implements OnInit {
  @Input() option: Object;
  @Input() checkoutState: CheckoutState;
  
  private _selectData;
  
  constructor() {
  
  }
  
  ngOnInit() {
    if (this.option['type'] == "date" || this.option['type'] == "date_time" || this.option['type'] == "time") {
      if (this.getOption()[this.option['option_id']] == null) {
        this.getOption()[this.option['option_id']] = {};
        if (this.option['type'] == "date" || this.option['type'] == "date_time") {
          this.getOption()[this.option['option_id']]['data_date'] = null;
        } else if (this.option['type'] == "time" || this.option['type'] == "date_time") {
          this.getOption()[this.option['option_id']]['data_time'] = null;
        }
      } else {
        // FIx xrt-1022 : khi add custom option có date time từ trên mangeto
        if (this.option['type'] == "date" || this.option['type'] == "date_time") {
          let month = this.getOption()[this.option['option_id']]['month'];
          let day   = this.getOption()[this.option['option_id']]['day'];
          let year  = this.getOption()[this.option['option_id']]['year'];
          
          if (!this.getOption()[this.option['option_id']].hasOwnProperty('data_date')) {
            this.getOption()[this.option['option_id']]['data_date'] = moment().year(year).month(month - 1).date(day).format("MM/DD/YYYY");
          }
        }
        if (this.option['type'] == "time" || this.option['type'] == "date_time") {
          let hour     = this.getOption()[this.option['option_id']]['hour'];
          let minute   = this.getOption()[this.option['option_id']]['minute'];
          let day_part = this.getOption()[this.option['option_id']]['day_part'];
          if (day_part == "pm") {
            hour = parseFloat(hour) + 12;
          }
          if (!this.getOption()[this.option['option_id']].hasOwnProperty('data_time')) {
            this.getOption()[this.option['option_id']]['data_time'] = moment().hour(hour).minute(minute).format();
          }
        }
      }
    }
  }
  
  
  ngAfterViewInit(): void {
  }
  
  getProduct(): Product {
    return this.checkoutState.productOptions.product;
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
  
  getOption() {
    return this.checkoutState.productOptions.options;
  }
  
}