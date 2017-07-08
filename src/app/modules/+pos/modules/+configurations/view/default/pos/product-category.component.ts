import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'pos-configurations-default-pos-product-category',
             templateUrl: 'product-category.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosConfigurationsDefaultPosProductCategoryComponent {
  @Input() entitiesState$: PosEntitiesState;
  
  constructor(protected store$: Store<any>) {
    this.entitiesState$ = this.store$.select('entities');
  }
}
