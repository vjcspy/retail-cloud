import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ConfigurationsState} from "../../../R/index";
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-magento-product',
             templateUrl: 'magento-product.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultCacheManagementMagentoProductComponent implements OnInit {
  configurationsState$: Observable<ConfigurationsState>;
  
  constructor(private store$: Store<any>) {
    this.configurationsState$ = this.store$.select('configurations');
  }
  
  ngOnInit() { }
}
