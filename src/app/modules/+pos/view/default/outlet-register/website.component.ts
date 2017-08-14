import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {PosGeneralState} from "../../../R/general/general.state";
import {AccountActions} from "../../../../../R/account/account.actions";
import {LocalStorage} from "ngx-webstorage";
import * as _ from 'lodash';
import {PosGeneralActions} from "../../../R/general/general.actions";
import {RouterActions} from "../../../../../R/router/router.actions";
import {PosPullState} from "../../../R/entities/pull.state";
import {NotifyManager} from "../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-outlet-register-website',
             templateUrl: 'website.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultOutletRegisterWebsiteComponent implements OnChanges, AfterViewInit {
  @Input() generalState: PosGeneralState;
  @Input() pullState: PosPullState;
  
  @LocalStorage('baseUrl')
  public baseUrl: string;
  
  constructor(public accountActions: AccountActions,
              protected notify: NotifyManager,
              public generalActions: PosGeneralActions,
              protected routerActions: RouterActions) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.baseUrl || this.baseUrl === "") {
      _.forEach(changes, (change: SimpleChange, key) => {
        if (key === 'generalState') {
          const currentState: PosGeneralState = change.currentValue;
          if (currentState.urls.count() > 0) {
            const first = currentState.urls.find((v) => _.isString(v['url']) && v['url'] !== "");
            if (first) {
              this.selectWebsite(first['url']);
            }
          }
        }
      });
    }
  }
  
  ngAfterViewInit(): void {
    if (_.isString(this.baseUrl) && this.baseUrl !== "") {
      this.generalActions.selectWebsite(this.baseUrl);
    }
  }
  
  selectWebsite($event) {
    if (this.pullState.isPullingChain) {
      this.notify.info('wait_until_data_pull_successfully');
      
      return;
    }
    
    if (_.isString($event) && $event !== 'null' && this.baseUrl !== $event) {
      this.baseUrl = $event;
      this.generalActions.selectWebsite(this.baseUrl);
    } else {
      this.notify.error("sorry_we_can_not_select_base_url");
    }
  }
  
  hasWebsite() {
    return this.generalState.urls.count() > 0;
  }
  
  go(path: string) {
    this.routerActions.go(path);
  }
}
