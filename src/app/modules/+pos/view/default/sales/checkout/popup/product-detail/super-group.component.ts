import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ProductOptionsState} from "../../../../../R/sales/checkout/popup/product-options.state";
import * as _ from 'lodash';
import {ProductHelper} from "../../../../../../core/framework/catalog/Helper/Product";
import {ProductOptionsActions} from "../../../../../R/sales/checkout/popup/product-options.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-product-detail-super-group',
             templateUrl: 'super-group.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutPopupProductDetailSuperGroupComponent implements OnInit {
  @Input() productOptionsState: ProductOptionsState;
  
  private _associatedProducts = {};
  
  private _super_group = {};
  
  constructor(private productOptionsActions: ProductOptionsActions) {}
  
  get super_group(): {} {
    return this._super_group;
  }
  
  ngOnInit() {
    // Default value for super group
    _.forEach(this.productOptionsState.product.x_options['grouped'], (group) => {
      this.getSuperGroup()[group['entity_id']] = parseFloat(group['qty']);
    });
    
    this.updateGroupData();
  }
  
  private updateGroupData() {
    this.productOptionsActions.updateProductOptionData('super_group', this.super_group, true);
  }
  
  getImage(pID) {
    let p = this.getAssociatedProduct(pID);
    return p ? p['origin_image'] : "";
  }
  
  getAssociatedProduct(id) {
    if (!this._associatedProducts.hasOwnProperty(id)) {
      this._associatedProducts[id] = _.find(this.productOptionsState.product.getData('associatedProducts'), (a) => parseInt(a['id'] + '') === parseInt(id + ''));
    }
    return this._associatedProducts[id];
  }
  
  getSuperGroup() {
    return this.super_group;
  }
  
  changeAssociateQty(id, qty) {
    this.super_group[id] = qty;
    this.updateGroupData();
  }
  
  isSalesAble(id) {
    ProductHelper.isSalesAble(this.getAssociatedProduct(id))
  }
  
}
