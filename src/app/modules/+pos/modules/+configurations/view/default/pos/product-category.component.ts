import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {RetailConfigState} from "../../../R/retail-config/retail-config.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-configurations-default-pos-product-category',
             templateUrl: 'product-category.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosConfigurationsDefaultPosProductCategoryComponent {
  @Input() entitiesState$: Observable<PosEntitiesState>;
  @Input() retailConfigState$: Observable<RetailConfigState>;
  
  constructor(protected store$: Store<any>) {
    this.entitiesState$     = this.store$.select('entities');
    this.retailConfigState$ = this.store$.map((store: any) => store.configurations.retailConfig).distinctUntilChanged();
  }
}
