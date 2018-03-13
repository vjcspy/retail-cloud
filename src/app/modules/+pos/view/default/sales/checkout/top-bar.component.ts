import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {PosConfigState} from "../../../../R/config/config.state";
import {FormControl} from "@angular/forms";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";
import {CheckoutPopupActions} from "../../../R/sales/checkout/popup/popup.actions";
import {CheckoutPopup} from "../../../R/sales/checkout/popup/popup.state";
import {PosQuoteState} from "../../../../R/quote/quote.state";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {CheckoutProductService} from "../../../R/sales/checkout/product/product.service";
import {Subject} from "rxjs/Subject";
import {TutorialService} from "../../../../modules/+tutorial/tutorial.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-top-bar',
             templateUrl: 'top-bar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutTopBarComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() checkoutProductState: CheckoutProductState;
  @Input() configState: PosConfigState;
  @Input() quoteState: PosQuoteState;
  
  protected searchString        = new FormControl();
  protected searchInputElem: any;
  
  protected scannerSubject = new Subject();
  
  constructor(private checkoutProductActions: CheckoutProductActions,
              public menuLeftActions: MenuLeftActions,
              protected notify: NotifyManager,
              public authenticateService: AuthenticateService,
              protected checkoutPopupActions: CheckoutPopupActions,
              protected checkoutProductService: CheckoutProductService,
              private tourService: TutorialService) {
    super();
  }
  
  ngOnInit() {
    if (this.tourService.tour.getCurrentStep() === 12) {
      this.tourService.tour.resume();
      this.tourService.tour.goTo(13);
    } else if (this.tourService.tour.getCurrentStep() === 21) {
      this.tourService.tour.resume();
      this.tourService.tour.next();
    }
  }
  
  ngAfterViewInit(): void {
    this.checkoutProductService.handleScanner((searchString) => {
      this.scannerSubject.next(searchString);
    }, true);
    
    this.subscribeObservable('subscript_scanner', () =>
      this.scannerSubject
          .asObservable()
          .filter(() => $('input:focus').length === 0)
          .subscribe((searchString) => {
            this.searchString.setValue(searchString, {emitEvent: false});
            this.checkoutProductActions.updateGridState({
                                                          searchString,
                                                          lastLuckySearchString: null
                                                        });
          }));
    
    this.subscribeObservable('subscribe_input_search', () =>
      this.searchString
          .valueChanges
          // .distinctUntilChanged()
          .debounceTime(this.configState.constrain['debounceTimeSearch'])
          .subscribe((searchString: string) => {
            this.checkoutProductActions.updateGridState({
                                                          searchString
                                                        });
          })
    );
  }
  
  openPopupCustomSale() {
    if (this.authenticateService.userCan('allow_using_custom_sale')) {
      if (!this.configState.posRetailConfig.enableCustomSale) {
        this.notify.error("do_not_allow_checkout_with_custom_sale");
        return false;
      }
      this.checkoutPopupActions.checkoutOpenPopup(CheckoutPopup.CUSTOM_SALE);
    } else {
      this.notify.error("not_have_permission_to_allow_using_custom_sale");
    }
  }
  
  customsalesPermission() {
    if(this.authenticateService.userCan('allow_using_custom_sale')){
      return true;
    }
    return false;
  }
  
  openPopupShipping() {
    if (this.authenticateService.userCan('make_shipment')) {
      if (this.canAddShipment()) {
        this.checkoutPopupActions.checkoutOpenPopup(CheckoutPopup.CUSTOMER_SHIPPING, {customerPopup: {customer: this.quoteState.customer}});
      }
    } else {
      this.notify.error("not_have_permission_to_make_shipment");
    }
  }
  
  canAddShipment() {
    return this.quoteState.items.count() > 0 && this.quoteState.customer && !!this.quoteState.customer['id'] && this.authenticateService.userCan('make_shipment');
  }
  
  checkEnter($event) {
    if ($event && $event['keyCode'] === 13) {
      if (typeof this.searchInputElem === 'undefined') {
        this.searchInputElem = jQuery('#pos_search_text');
      }
      
      this.searchInputElem.select();
      this.checkoutProductActions.updateGridState({
                                                    searchString: this.searchString.value,
                                                    lastLuckySearchString: null
                                                  });
    }
  }
  
  ngOnDestroy() {
    super.ngOnDestroy();
    
    this.checkoutProductService.disableHandleScanner();
  }
  
  openLeftBarMenu() {
    this.tourService.tour.end();
    this.menuLeftActions.changeOpenState(true)
  }
}
