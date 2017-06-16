import {Product} from "../../../catalog/Model/Product";
import {Format} from "../../../Locale/Format";
import {AbstractItem} from "./Item/AbstractItem";

export class Item extends AbstractItem {
  checkData(): Item {
    /*TODO: validate quote Item*/
    return this;
  }
  
  representProduct(product: Product): boolean {
    let itemProduct = this.getProduct();
    if (!product || itemProduct.getData('id') != product.getData('id'))
      return false;
    
    /*FIXME: Need check configurable, group and bundle by options*/
    return true;
  }
  
  getProduct(): Product {
    return this.getData('product');
  }
  
  addQty(qty: number): Item {
    /**
     * We can't modify quantity of existing items which have parent
     * This qty declared just once during add process and is not editable
     */
    if (!this.getParentItem() || !this.getData('id')) {
      let _localeFormat = new Format();
      qty               = _localeFormat.getNumber(qty);
      qty               = qty > 0 ? qty : 1;
      this.setData('qty_to_add', qty);
      this.setData('qty', qty + this.getData('qty'));
    }
    return this;
  }
  
  getBuyRequest() {
    return this.getData('buy_request');
  }
}
