import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {ConfigurationsState} from "../../../../R/index";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterGridComponent {
  configurations$: Observable<ConfigurationsState>;
  
  constructor(private store$: Store<any>) {
    this.configurations$ = this.store$.select('configurations');
  }
}
