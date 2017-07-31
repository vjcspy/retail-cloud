import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs/Observable";
import {PullPerformanceState} from "../../../R/cache/pull-performance/pull-performance.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-pull-performance',
             templateUrl: 'pull-performance.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultCacheManagementPullPerformanceComponent implements OnInit {
  pullPerformanceState$: Observable<PullPerformanceState>;
  
  constructor(private store$: Store<any>) {
    this.pullPerformanceState$ = this.store$.map((store) => store.configurations.cache.pullPerformance).distinctUntilChanged();
  }
  
  ngOnInit() { }
}
