import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MagentoProductState} from "../../../../R/cache/magento-product/magento-product.state";
import {MagentoProductActions} from "../../../../R/cache/magento-product/magento-product.actions";
import {StoreHelper} from "../../../../../../core/framework/store/Helper/StoreHelper";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-magento-product-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultCacheManagementMagentoProductGridComponent implements OnInit {
  @Input() magentoProductSate: MagentoProductState;
  
  constructor(public magentoProductActions: MagentoProductActions) { }
  
  ngOnInit() { }
  
  getStoreName(storeId) {
    const name = StoreHelper.getStoreById(storeId);
    
    return !!name ? name['name'] : storeId;
  }
}
