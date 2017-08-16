import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {FormValidationService} from "../../../../../../../share/provider/form-validation";
import {ProductOptionsState} from "../../../../../R/sales/checkout/popup/product-options.state";
import {PriceFormatPipe} from "../../../../../pipes/price-format";
import {AbstractSubscriptionComponent} from "../../../../../../../../code/AbstractSubscriptionComponent";
import {ProductOptionsActions} from "../../../../../R/sales/checkout/popup/product-options.actions";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail-bundle-options',
             templateUrl: 'bundle-options.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailBundleOptionsComponent extends AbstractSubscriptionComponent implements OnInit {
  isActive: boolean = false;
  
  @Input() option: Object;
  @Input() productOptionsState: ProductOptionsState;
  
  protected _bundleProperty = {
    canChangeQty: true,
    multiSelect: false
  };
  
  private _validProperty = {
    isValid: true,
    mess: ""
  };
  
  private _bundle_option     = {};
  private _bundle_option_qty = {};
  
  get bundle_option_qty(): {} {
    return this._bundle_option_qty;
  }
  
  get bundle_option(): {} {
    return this._bundle_option;
  }
  
  constructor(private _elementRef: ElementRef,
              private formValidationService: FormValidationService,
              private productOptionsActions: ProductOptionsActions) {
    super();
  }
  
  ngOnInit(): void {
    this._bundle_option     = Object.assign({}, this.productOptionsState.optionData.bundle_option);
    this._bundle_option_qty = Object.assign({}, this.productOptionsState.optionData.bundle_option_qty);
    
    _.forEach(this.option['selections'], (selection) => {
      this._initNameOfSelection(selection);
    });
    
    //init default value for bundle selection(default selection and qty)
    if (_.indexOf(['multi', 'checkbox'], this.option['type']) > -1) {
      this._bundleProperty.multiSelect  = true;
      this._bundleProperty.canChangeQty = false;
      
      if (!this._bundle_option[this.option['option_id']]) {
        this._bundle_option[this.option['option_id']] = [];
        _.forEach(this.option['selections'], (selection) => {
          
          if (selection['is_default'] == '1')
            this._bundle_option[this.option['option_id']].push(selection['selection_id']);
        });
      }
    } else {
      if (!this._bundle_option[this.option['option_id']]) {
        _.forEach(this.option['selections'], (selection) => {
          if (selection['is_default'] == '1') {
            this._bundle_option_qty[this.option['option_id']] = parseFloat(selection['selection_qty']);
            this._bundle_option[this.option['option_id']]     = selection['selection_id'];
            this._bundleProperty.canChangeQty                 = selection['selection_can_change_qty'] === '1';
            return false;
          }
        });
      } else {
        // FIx 1560 : refactor status change QTY when view detail item in cart
        _.forEach(this.option['selections'], (selection) => {
          if (this._bundle_option_qty[this.option['option_id']] == parseFloat(selection['selection_qty'])
              && this._bundle_option[this.option['option_id']] == selection['selection_id']) {
            this._bundleProperty.canChangeQty = selection['selection_can_change_qty'] === '1';
          }
        });
      }
    }
    this.updateBundleData();
    this.subscribeObservable("validate_bundle_option", () => this.formValidationService
                                                                 .onSubmitOrCancel(
                                                                   'pos-product-detail',
                                                                   () => this._validateOption(true),
                                                                   () => this._validateOption(false)
                                                                 ));
  }
  
  private updateBundleData() {
    this.productOptionsActions.updateProductOptionData('bundle_option_qty', this.bundle_option_qty);
    this.productOptionsActions.updateProductOptionData('bundle_option', this.bundle_option);
  }
  
  private _initNameOfSelection(selection) {
    let _name       = selection['name'];
    let priceFormat = new PriceFormatPipe();
    if (this.productOptionsState.product.x_options['bundle']['type_price'] == "1") {
      if (selection['selection_price_type'] == "0") {
        // fixed price
        _name += " + " + priceFormat.transform(selection['selection_price_value']);
      }
      else {
        _name += " + " + parseFloat(selection['selection_price_value']).toFixed(2) + "%";
      }
    } else {
      _name += " " + priceFormat.transform(selection['price']);
    }
    selection['label'] = _name;
  }
  
  private _validateOption(needValidate: boolean) {
    if (!needValidate || this.option['required'] != '1') {
      this._validProperty = {
        isValid: true,
        mess: ""
      };
      return true;
    } else {
      this._validProperty =
        <any>this.formValidationService.validate("require", this._bundle_option[this.option['option_id']]);
      return this._validProperty.isValid;
    }
  }
  
  changeQtyOption(optionId, qty) {
    this._bundle_option_qty[optionId] = qty;
    this.updateBundleData();
  }
  
  selectSelection(selection: Object) {
    // Khi chọn thì remove validate đi
    this._validateOption(false);
    
    if (typeof this._bundle_option[this.option['option_id']] == "undefined"
        || !this._bundle_option[this.option['option_id']]) {
      if (this.option['type'] == 'multi' || this.option['checkbox']) {
        this._bundle_option[this.option['option_id']] = [];
      }
    }
    if (this.option['type'] == 'multi' || this.option['type'] == 'checkbox') {
      if (this.isSelectedSelection(selection)) {
        _.remove(this._bundle_option[this.option['option_id']],
                 (selectionId) => selectionId == selection['selection_id']);
      } else {
        this._bundle_option[this.option['option_id']].push(selection['selection_id']);
      }
    } else {
      this._bundle_option[this.option['option_id']] =
        this.isSelectedSelection(selection) ? "" : selection['selection_id'];
      
      // check default qty and can edit qty
      this._bundle_option_qty[this.option['option_id']] = parseFloat(selection['selection_qty']);
      this._bundleProperty.canChangeQty                 = selection['selection_can_change_qty'] == '1';
    }
    this.updateBundleData();
  }
  
  isSelectedSelection(selection: Object) {
    if (this.option['type'] == 'multi' || this.option['type'] == 'checkbox') {
      if (_.isArray(this.productOptionsState.optionData.bundle_option[this.option['option_id']])) {
        return _.indexOf(this.productOptionsState.optionData.bundle_option[this.option['option_id']], selection['selection_id']) > -1;
      }
      else {
        return false;
      }
    } else {
      return this.productOptionsState.optionData.bundle_option[this.option['option_id']] === selection['selection_id'];
    }
  }
  
  toggleActiveState(event: any) {
    if (event.target.className.indexOf("count-num") == -1)
      this.isActive = !this.isActive;
  }
  
  /*
   * Hiển thị những select đã được chọn khi không active
   */
  getSelectedOfCurrentOption() {
    let selectedSelection = [];
    if (this.option['type'] == 'multi' || this.option['type'] == 'checkbox') {
      if (_.isArray(this.productOptionsState.optionData.bundle_option[this.option['option_id']])) {
        _.forEach(this.productOptionsState.optionData.bundle_option[this.option['option_id']], (selectionId) => {
          let _selection = _.find(this.option['selections'], _s => _s['selection_id'] == selectionId);
          if (_selection)
            selectedSelection.push(_selection);
        });
      }
    }
    else {
      if (this.productOptionsState.optionData.bundle_option[this.option['option_id']]) {
        let _selection = _.find(this.option['selections'],
                                _s => _s['selection_id'] == this.productOptionsState.optionData.bundle_option[this.option['option_id']]);
        if (_selection)
          selectedSelection.push(_selection);
      }
    }
    return selectedSelection;
  }
  
  getFloatQty(qty): number {
    return parseFloat(qty);
  }
  
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isActive = false;
    }
  }
}
