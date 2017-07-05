import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {CheckoutProductState} from "../../../R/sales/checkout/product/product.state";
import {CheckoutProductCategoryActions} from "../../../R/sales/checkout/product/category/category.actions";
import {CheckoutProductActions} from "../../../R/sales/checkout/product/product.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-category',
             templateUrl: 'category.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesCheckoutCategoryComponent implements OnInit, AfterViewInit {
  @ViewChild('productCategory') productCategory: ElementRef;
  @ViewChild('productBreadcrumb') productBreadcrumb: ElementRef;
  
  @Input() checkoutProductState: CheckoutProductState;
  
  constructor(protected checkoutProductCategoryActions: CheckoutProductCategoryActions, protected checkoutProductActions: CheckoutProductActions) { }
  
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
