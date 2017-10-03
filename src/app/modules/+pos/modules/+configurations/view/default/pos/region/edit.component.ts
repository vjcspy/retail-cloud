import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ConfigurationsState} from "../../../../R/index";
import {Store} from "@ngrx/store";
import {PosEntitiesState} from "../../../../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-region-edit',
             templateUrl: 'edit.component.html',
             // template : '<h2>asdsa</h2>'
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosRegionEditComponent {
  configurationsState$: Observable<ConfigurationsState>;
  entitiesState$: Observable<PosEntitiesState>;
  
  constructor(private store$: Store<any>) {
    this.configurationsState$ = this.store$.select('configurations');
    this.entitiesState$       = this.store$.select('entities');
  }
}
