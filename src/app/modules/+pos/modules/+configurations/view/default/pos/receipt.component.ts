import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {Store} from "@ngrx/store";
import {ConfigurationsReceiptState} from "../../../R/receipts/receipt.state";
import {PosGeneralState} from "../../../../../R/general/general.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-receipt',
             templateUrl: 'receipt.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosReceiptComponent {
  entitiesState$: Observable<PosEntitiesState>;
  configurationsReceiptState$: Observable<ConfigurationsReceiptState>;
  generalState$: Observable<PosGeneralState>;
  
  constructor(private store$: Store<any>) {
    this.entitiesState$              = this.store$.select('entities');
    this.configurationsReceiptState$ = this.store$.map((store: any) => store.configurations.receipt).distinctUntilChanged();
    this.generalState$               = this.store$.select('general');
  }
}
