import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RetailConfigService} from "../../../R/retail-config/retail-config.service";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {RetailConfigState} from "../../../R/retail-config/retail-config.state";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-customer',
             templateUrl: 'customer.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosCustomerComponent {
  retailConfigState$: Observable<RetailConfigState>;
  entitiesState$: Observable<PosEntitiesState>;
  
  constructor(protected store$: Store<any>, protected retailConfigService: RetailConfigService) {
    this.entitiesState$     = this.store$.select('entities');
    this.retailConfigState$ = this.store$.map((store: any) => store.configurations.retailConfig).distinctUntilChanged();
  }
  
  getRetailConfigSnapshot() {
    return this.retailConfigService.retailConfigSnapshot;
  }
}
