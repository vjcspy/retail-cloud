import {AbstractType} from "../../../../../framework/catalog/Model/Product/Type/AbstractType";
import {DataObject} from "../../../../../framework/General/DataObject";
import {Product} from "../../../../../framework/catalog/Model/Product";
import * as _ from 'lodash';
import {GiftCardOption} from "../../../Api/Data/OptionInterface";

export class Giftcard extends AbstractType {
  
  protected _prepareProduct(buyRequest: DataObject, product: Product, processMode: string): Product[] {
    let result = super._prepareProduct(buyRequest, product, processMode);
    
    if (_.isString(result)) {
      return result;
    }
    
    let giftCardBuyRequest = new DataObject();
    giftCardBuyRequest.addData(buyRequest.getData('gift_card'));
    
    let amount;
    try {
      this.validateBuyRequest(giftCardBuyRequest, product, processMode);
      amount = this.getAmount(giftCardBuyRequest, product);
      this.validateAmount(giftCardBuyRequest, product, processMode, amount);
    } catch (e) {
      return e.getMessage();
    }
    
    product.addCustomOption(GiftCardOption.AMOUNT, amount, product)
           .addCustomOption(GiftCardOption.SENDER_NAME, giftCardBuyRequest.getData(GiftCardOption.SENDER_NAME), product)
           .addCustomOption(GiftCardOption.RECIPIENT_NAME, giftCardBuyRequest.getData(GiftCardOption.RECIPIENT_NAME), product)
           .addCustomOption(GiftCardOption.SENDER_EMAIL, giftCardBuyRequest.getData(GiftCardOption.SENDER_EMAIL), product)
           .addCustomOption(GiftCardOption.RECIPIENT_EMAIL, giftCardBuyRequest.getData(GiftCardOption.RECIPIENT_EMAIL), product)
           .addCustomOption(GiftCardOption.HEADLINE, giftCardBuyRequest.getData(GiftCardOption.HEADLINE), product)
           .addCustomOption(GiftCardOption.MESSAGE, giftCardBuyRequest.getData(GiftCardOption.MESSAGE), product)
           .addCustomOption(GiftCardOption.DELIVERY_DATE, giftCardBuyRequest.getData(GiftCardOption.DELIVERY_DATE)['data_date'], product)
           .addCustomOption(GiftCardOption.DELIVERY_DATE_TIMEZONE, giftCardBuyRequest.getData(GiftCardOption.DELIVERY_DATE_TIMEZONE), product)
           .addCustomOption(GiftCardOption.GIFTCARD_TYPE, giftCardBuyRequest.getData(GiftCardOption.GIFTCARD_TYPE), product)
           .addCustomOption(GiftCardOption.TEMPLATE, giftCardBuyRequest.getData(GiftCardOption.TEMPLATE), product);
    
    return result;
  }
  
  protected validateBuyRequest(buyRequet: DataObject, product: Product, processMode: string): void {
  
  }
  
  protected validateAmount(buyRequest: DataObject, product: Product, processMode: string, amount): void {
  
  }
  
  protected getAmount(buyRequest: DataObject, product: Product) {
    let amountOptions        = product.x_options['gift_card']['getAmountOptions'];
    let selectedAmountOption = buyRequest.getData(GiftCardOption.AMOUNT);
    let customAmount         = buyRequest.getData(GiftCardOption.CUSTOM_AMOUNT);
    
    let amount = null;
    
    if (this.isCustomAmount(buyRequest, product)) {
      amount = customAmount;
    } else {
      amount = selectedAmountOption;
    }
    
    return amount;
  }
  
  isAllowOpenAmount(product: Product): boolean {
    return product.x_options['gift_card']['isAllowOpenAmount'] === true;
  }
  
  isCustomAmount(buyRequest: DataObject, product: Product) {
    return (buyRequest.getData(GiftCardOption.AMOUNT) === 'custom' || !buyRequest.getData(GiftCardOption.AMOUNT)) && this.isAllowOpenAmount(product);
  }
}
