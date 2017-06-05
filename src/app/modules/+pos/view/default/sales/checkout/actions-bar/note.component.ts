import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {CheckoutState} from "../../../../R/sales/checkout.state";
import {PosCheckoutActions} from "../../../../R/sales/checkout.actions";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar-note',
             templateUrl: 'note.component.html'
           })
export class PosDefaultSalesCheckoutActionsBarNoteComponent {
  @Input() checkoutState: CheckoutState;
  @Input() quoteState: PosQuoteState;
  @ViewChild('noteElem') noteElem: ElementRef;
  
  constructor(protected checkoutActions: PosCheckoutActions, protected quoteActions: PosQuoteActions) { }
  
  @HostListener('document:click', ['$event.target']) onClick(target) {
    if (target.className.indexOf('icon-edit') > -1 || target.className.indexOf('snote-edit') > -1)
      return;
    if (this.noteElem && !this.noteElem.nativeElement.contains(target)) {
      this.quoteActions.updateQuoteInfoState('isOpeningNote', false);
    }
  }
  
}
