import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ProductOptionsState} from "../../../../../R/sales/checkout/popup/product-options.state";
import {ProductOptionsActions} from "../../../../../R/sales/checkout/popup/product-options.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail-super-attribute',
             templateUrl: 'super-attribute.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailSuperAttributeComponent {
  @Input() attribute: Object;
  @Input() productOptionsState: ProductOptionsState;
  private _super_attribute = {};
  
  get super_attribute(): {} {
    return this._super_attribute;
  }
  
  constructor(private productOptionsActions: ProductOptionsActions) {
  
  }
  
  changeValue(value: any): void {
    this._super_attribute[this.attribute['id']] = value;
    this.updateProductSuperAttribute();
  }
  
  private updateProductSuperAttribute() {
    this.productOptionsActions.updateProductOptionData('super_attribute', this.super_attribute);
  }
  
  getOptionsSelectData() {
    return this.productOptionsState.product.getData('attributeSelectData')[this.attribute['id']];
  }
  
}
