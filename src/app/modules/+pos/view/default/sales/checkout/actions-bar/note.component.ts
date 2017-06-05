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
    console.log(target.className);
    if (target.className.indexOf('icon-edit') > -1 || target.className.indexOf('snote-edit') > -1) {
    }
    else if (this.noteElem && !this.noteElem.nativeElement.contains(target)) {
      this.checkoutActions.updateActionCartState('isOpeningNote', false);
    }
  }
  
  protected toggleNote(event) {
    if (event.target.className.indexOf('icon-edit') > -1 || event.target.className.indexOf('snote-edit') > -1) {
      this.checkoutActions.updateActionCartState('isOpeningNote', !this.checkoutState.isOpeningNote)
    }
  }
}
