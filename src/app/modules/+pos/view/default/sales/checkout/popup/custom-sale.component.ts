import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import {FormValidationService} from "../../../../../../share/provider/form-validation";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosConfigState} from "../../../../../R/config/config.state";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CheckoutPopupActions} from "../../../../R/sales/checkout/popup/popup.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-custom-sale',
             templateUrl: 'custom-sale.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomSaleComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input() posConfigState: PosConfigState;
  
  public data = {
    customSaleName: '',
    customSaleQty: 1,
    customSalePrice: 0,
  };
  
  constructor(private formValidation: FormValidationService,
              private notify: NotifyManager,
              private quoteActions: PosQuoteActions,
              private checkoutPopupActions: CheckoutPopupActions) { }
  
  cancelCustomSale() {
    this.checkoutPopupActions.checkoutOpenPopup(null);
  }
  
  addCustomSaleToQuote() {
    this.formValidation.submit('pos_checkout_custom_sale_form', async () => {
      let customSaleProduct = this.posConfigState.setting.product.getCustomSaleProduct();
      if (!customSaleProduct || !customSaleProduct['id']) {
        this.notify.error("can_not_find_custom_sale_product");
        return;
      }
      await this.quoteActions.selectProductToAdd(customSaleProduct,
                                                 this.data.customSaleQty,
                                                 true,
                                                 {
                                                   custom_price: this.data.customSalePrice,
                                                   custom_sale: {
                                                     name: this.data.customSaleName
                                                   }
                                                 }, false);
      this.posQuoteState.quote.addRetailAdditionData('has_custom_sale', true);
    }, true);
  }
}
