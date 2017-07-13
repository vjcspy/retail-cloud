import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {PosEntitiesState} from "../../../../../R/entities/entities.state";
import {RetailConfigState} from "../../../R/retail-config/retail-config.state";
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-integration',
             templateUrl: 'integration.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosIntegrationComponent implements OnInit {
  @Input() entitiesState$: Observable<PosEntitiesState>;
  @Input() retailConfigState$: Observable<RetailConfigState>;
  
  constructor(protected store$: Store<any>) {
    this.entitiesState$     = this.store$.select('entities');
    this.retailConfigState$ = this.store$.map((store: any) => store.configurations.retailConfig).distinctUntilChanged();
  }
  
  ngOnInit() { }
}
