import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {Store} from "@ngrx/store";
import {ConfigurationsState} from "../../../R/index";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-payment',
             templateUrl: 'payment.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosPaymentComponent {
  entitiesState$: Observable<PosEntitiesState>;
  configurationsState$: Observable<ConfigurationsState>;
  
  constructor(private store$: Store<any>) {
    this.entitiesState$       = this.store$.select('entities');
    this.configurationsState$ = this.store$.select('configurations');
  }
  
}
