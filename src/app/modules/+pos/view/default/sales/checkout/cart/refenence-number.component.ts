import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {FormValidationService} from "../../../../../../share/provider/form-validation";
import {NotifyManager} from "../../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-cart-reference-number',
             templateUrl: 'reference-number.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCartReferenceNumberComponent {
  @Input() posQuoteState: PosQuoteState;
  @Input('checkIsRefund') checkIsRefund: boolean;
  protected _validProperty = {
    isValid: true,
    mess: ""
  };
  
  constructor(protected posQuoteActions: PosQuoteActions,
              protected formValidationService: FormValidationService,
              protected notify: NotifyManager) {}
  
  addReferenceNumber($event) {
    this._validProperty = <any>this.formValidationService.validate('applicant-reference-number', $event.target['value']);
    if (!this._validProperty.isValid) {
      this.notify.warning(this._validProperty.mess);
      this.posQuoteActions.addReferenceNumber($event.target['value']);
    } else {
      this.posQuoteActions.addReferenceNumber($event.target['value']);
    }
  }
  
}
