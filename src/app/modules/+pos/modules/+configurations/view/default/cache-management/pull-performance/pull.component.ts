import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PullPerformanceState} from "../../../../R/cache/pull-performance/pull-performance.state";
import * as _ from 'lodash';
import {PullPerformanceActions} from "../../../../R/cache/pull-performance/pull-performance.actions";
import {List} from "immutable";
import {StoreHelper} from "../../../../../../core/framework/store/Helper/StoreHelper";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-cache-management-pull-performance-pull',
             templateUrl: 'pull.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultCacheManagementPullPerformancePullComponent implements OnInit {
  @Input() pullPerformanceState: PullPerformanceState;
  public pullData: PullPerformanceState;
  
  constructor(public pullPerformanceActions: PullPerformanceActions) { }
  
  ngOnInit() {
    this.pullData = (this.pullPerformanceState as any).toJS();
  }
  
  getStoreElementData() {
    return StoreHelper.getStoreElementData()['data'];
  }
  
  getTotalTime(performancePages: List<any>) {
    return performancePages.reduce((totalTime, val) => {
      if (val.hasOwnProperty('endTime') && val.hasOwnProperty('startTime')) {
        totalTime += val['endTime'].diff(val['startTime']) / 1000;
      }
      return _.round(totalTime, 3);
    }, 0);
  }
}
