import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {CartActionBarState} from "../../../../R/sales/checkout/cart/action-bar.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CartActionBarActions} from "../../../../R/sales/checkout/cart/action-bar.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar-note',
             templateUrl: 'note.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutActionsBarNoteComponent {
  @Input() cartActionBarState: CartActionBarState;
  @Input() quoteState: PosQuoteState;
  @ViewChild('noteElem') noteElem: ElementRef;
  
  constructor(protected cartActionBarActions: CartActionBarActions, protected quoteActions: PosQuoteActions) { }
  
  @HostListener('document:click', ['$event.target']) onClick(target) {
    if (target.className.indexOf('icon-edit') > -1 || target.className.indexOf('snote-edit') > -1) {
    }
    else if (this.noteElem && !this.noteElem.nativeElement.contains(target)) {
      this.cartActionBarActions.changeStateNotePopup(false);
    }
  }
  
  protected toggleNote(event) {
    if (event.target.className.indexOf('icon-edit') > -1 || event.target.className.indexOf('snote-edit') > -1) {
      this.cartActionBarActions.changeStateNotePopup(!this.cartActionBarState.isOpeningNote)
    }
  }
}
