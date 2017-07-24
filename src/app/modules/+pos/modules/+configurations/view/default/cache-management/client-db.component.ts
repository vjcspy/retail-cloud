import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {ConfigurationsState} from "../../../R/index";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-client-db',
             templateUrl: 'client-db.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultCacheManagementClientDBComponent implements OnInit {
  configurationsState$: Observable<ConfigurationsState>;
  
  constructor(private store$: Store<any>) {
    this.configurationsState$ = this.store$.select('configurations');
  }
  
  ngOnInit() { }
}
