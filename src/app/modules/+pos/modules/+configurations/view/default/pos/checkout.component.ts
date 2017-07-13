import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {RetailConfigState} from "../../../R/retail-config/retail-config.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-checkout',
             templateUrl: 'checkout.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosCheckoutComponent {
  @Input() entitiesState$: Observable<PosEntitiesState>;
  @Input() retailConfigState$: Observable<RetailConfigState>;
  
  constructor(protected store$: Store<any>) {
    this.entitiesState$     = this.store$.select('entities');
    this.retailConfigState$ = this.store$.map((store: any) => store.configurations.retailConfig).distinctUntilChanged();
  }
}
