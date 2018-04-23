import {Price as CatalogPrice} from "../../../../../../framework/catalog/Model/Product/Type/Price";
import {Product} from "../../../../../../framework/catalog/Model/Product";
import {GiftCardOption} from "../../../../Api/Data/OptionInterface";

export class Price extends CatalogPrice {
  
  getBasePrice(product: Product, qty: any = null): number {
    return this.applyAmount(product, isNaN(product.getPrice()) ? 0 : product.getPrice());
  }
  
  protected applyAmount(product: Product, price: number) {
    if (product.getCustomOptions()) {
      let customOption = product.getCustomOption(GiftCardOption.AMOUNT);
      if (customOption) {
        price += parseFloat(customOption.getValue());
      }
    }
    return price;
  }
}
