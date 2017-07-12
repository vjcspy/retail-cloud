import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {ConfigurationsState} from "../../../../../R/index";
import {Store} from "@ngrx/store";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-outlet-register-edit-register',
             templateUrl: 'register.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosOutletRegisterEditRegisterComponent {
  configurationsState$: Observable<ConfigurationsState>;
  
  constructor(private route: ActivatedRoute,
              private store$: Store<any>) {
    this.configurationsState$ = this.store$.select('configurations');
  }
}
