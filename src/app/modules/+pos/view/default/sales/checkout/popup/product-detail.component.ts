import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ProductOptionsActions} from "../../../../R/sales/checkout/popup/product-options.actions";
import {ProductOptionsState} from "../../../../R/sales/checkout/popup/product-options.state";
import * as _ from 'lodash';
import {FormValidationService} from "../../../../../../share/provider/form-validation";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail',
             templateUrl: 'product-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailComponent implements OnInit {
  @Input() productOptionsState: ProductOptionsState;
  
  indexImage: number = 0;
  
  constructor(public productOptionsActions: ProductOptionsActions,
              protected formValidation: FormValidationService) { }
  
  ngOnInit() {
  }
  
  changeIndexImage(isIncrease) {
    if (isIncrease === 1) {
      if (this.indexImage < (this.productOptionsState.product.media_gallery.length - 1)) {
        this.indexImage += 1;
      }
    } else {
      if (this.indexImage > 0) {
        this.indexImage -= 1;
      }
    }
  }
  
  private _attributes;
  
  convertAttributeObjectToArray() {
    if (typeof this._attributes === 'undefined') {
      if (this.productOptionsState.product.getTypeId() == 'configurable') {
        this._attributes = [];
        _.forEach(this.productOptionsState.product.x_options['configurable']['attributes'], (attribute) => {
          this._attributes.push(attribute);
        });
      }
    }
    return this._attributes;
  }
  
  changeQty(isIncrease: boolean = true) {
    const currentQty = this.productOptionsState.buyRequest.getData('qty');
    if (isIncrease) {
      this.productOptionsState.buyRequest.setData('qty', parseFloat(currentQty) + 1);
    } else {
      if (currentQty > 1) {
        this.productOptionsState.buyRequest.setData('qty', parseFloat(currentQty) - 1);
      }
    }
  }
  
  hasImageGallery() {
    return _.isArray(this.productOptionsState.product.media_gallery)
  }
  
  confirmProductOption() {
    this.formValidation.submit('pos-product-detail', () => {
      this.productOptionsActions.confirmProductOptions();
    });
  }
  
  cancelProductOption() {
    this.formValidation.cancel('pos-product-detail', () => {
      this.productOptionsActions.cancelProductOptions();
    });
  }
}
