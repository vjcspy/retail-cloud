import {Component, Input, OnInit} from '@angular/core';
import {MagentoProductState} from "../../../../R/cache/magento-product/magento-product.state";
import {MagentoProductActions} from "../../../../R/cache/magento-product/magento-product.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-magento-product-grid',
             templateUrl: 'grid.component.html'
           })

export class ConfigurationsDefaultCacheManagementMagentoProductGridComponent implements OnInit {
  @Input() magentoProductSate: MagentoProductState;
  
  constructor(public magentoProductActions: MagentoProductActions) { }
  
  ngOnInit() { }
}
