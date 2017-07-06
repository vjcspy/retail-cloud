import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, OnInit, SimpleChanges, ViewChild
} from '@angular/core';
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {CheckoutProductCategoryActions} from "../../../R/sales/checkout/product/category/category.actions";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";
import {PerfectScrollDirective} from "../../../../../share/directives/perfect-scroll";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-category',
             templateUrl: 'category.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCategoryComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('productCategory') productCategory: ElementRef;
  @ViewChild('productBreadcrumb') productBreadcrumb: ElementRef;
  @ViewChild(PerfectScrollDirective) vc: PerfectScrollDirective;
  @Input() checkoutProductState: CheckoutProductState;
  
  constructor(protected checkoutProductCategoryActions: CheckoutProductCategoryActions, protected checkoutProductActions: CheckoutProductActions) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    _.forEach(changes, (v, k) => {
      if (k === 'checkoutProductState') {
        setTimeout(() => {
          this.vc.update();
        }, 250);
      }
    })
  }
  
  ngOnInit() { }
  
  ngAfterViewInit(): void {
  }
  
  private updateCategoryMode(isCategoryMode: boolean = true) {
    this.checkoutProductCategoryActions.toggleCategory(isCategoryMode);
  }
  
  private saveCategoryHeight() {
    // Default must have category to calculate default height
    if (this.checkoutProductState.isCategoryMode === true) {
      this.checkoutProductCategoryActions.saveCategoryHeight({
                                                               totalCategoryHeight: this.productCategory.nativeElement.offsetHeight,
                                                               breadcrumbHeight: this.productBreadcrumb.nativeElement.offsetHeight,
                                                             });
    }
  }
  
  toggleCategoryMode() {
    this.updateCategoryMode(!this.checkoutProductState.isCategoryMode);
  }
  
  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.saveCategoryHeight();
  }
  
  changeViewMode(isGridMode: boolean = true) {
    if (isGridMode !== this.checkoutProductState.isGridMode) {
      this.checkoutProductActions.changeViewMode(isGridMode);
    }
  }
}
