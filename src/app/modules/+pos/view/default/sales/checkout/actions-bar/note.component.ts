import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CartActionBarState} from "../../../../R/sales/checkout/cart/action-bar.state";
import {PosQuoteState} from "../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {CartActionBarActions} from "../../../../R/sales/checkout/cart/action-bar.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar-note',
             templateUrl: 'note.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutActionsBarNoteComponent implements OnInit {
  @Input() cartActionBarState: CartActionBarState;
  @Input() quoteState: PosQuoteState;
  public note: string;
  
  constructor(public cartActionBarActions: CartActionBarActions,
              protected quoteActions: PosQuoteActions,
              private notify: NotifyManager) { }
  
  ngOnInit(): void {
    this.note = this.quoteState.quote.getData('retail_note');
  }
  
  saveNote() {
    this.quoteState.quote.setData('retail_note', this.note);
    this.cartActionBarActions.changeModePopup(null);
    this.notify.success("save_note_successfully");
  }
}
