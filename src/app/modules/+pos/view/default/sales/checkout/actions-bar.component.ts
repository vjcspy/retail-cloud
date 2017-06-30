import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {CartActionBarState} from "../../../R/sales/checkout/cart/action-bar.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {CartCustomerState} from "../../../R/sales/checkout/cart/customer.state";
import {CartCustomerActions} from "../../../R/sales/checkout/cart/customer.actions";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";
import {CartActionBarActions} from "../../../R/sales/checkout/cart/action-bar.actions";
import {PosSyncWishlistActions} from "../../../../R/sync/actions/wishlist.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-actions-bar',
             templateUrl: 'actions-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutActionBarComponent implements OnInit {
  @Input() cartActionBarState: CartActionBarState;
  @Input() quoteState: PosQuoteState;
  @Input() cartCustomerState: CartCustomerState;
  @ViewChild('actionsContainer') actionsContainer: ElementRef;
  
  constructor(protected cartCustomerActions: CartCustomerActions,
              public posQuoteActions: PosQuoteActions,
              public cartActionBarActions: CartActionBarActions,
              public posSyncWishlistActions: PosSyncWishlistActions) {}
  
  ngOnInit() { }
  
  @HostListener('document:click', ['$event.target']) onClick(target) {
    if (target.className.indexOf('icon-more2') > -1)
      return;
    
    if (this.actionsContainer && !this.actionsContainer.nativeElement.contains(target)) {
      if (this.cartActionBarState.isOpenActions === true) {
        this.cartActionBarActions.changeModeActionPopup(false);
      }
    }
  }
}
