import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {PosGeneralState} from "../../../R/general/general.state";
import {AccountActions} from "../../../../../R/account/account.actions";
import {LocalStorage} from "ngx-webstorage";
import * as _ from 'lodash';
import {PosGeneralActions} from "../../../R/general/general.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-outlet-register-website',
             templateUrl: 'website.component.html'
           })
export class PosDefaultOutletRegisterWebsiteComponent implements OnInit, OnChanges {
  @Input() generalState: PosGeneralState;
  
  @LocalStorage('baseUrl')
  public baseUrl: string;
  
  constructor(public accountActions: AccountActions, public generalActions: PosGeneralActions) { }
  
  ngOnInit() { }
  
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
    if (_.isString($event) && $event !== 'null' && this.baseUrl !== $event) {
      this.baseUrl = $event;
      this.generalActions.selectWebsite(this.baseUrl);
    }
  }
  
  hasWebsite() {
    return this.generalState.urls.count() > 0;
  }
}
