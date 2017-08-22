import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosGeneralActions} from "../../../R/general/general.actions";
import {PosPullState} from "../../../R/entities/pull.state";
import {NotifyManager} from "../../../../../services/notify-manager";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-outlet-register-outlets',
             templateUrl: 'outlets.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultOutletRegisterOutletsComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() pullState: PosPullState;
  
  constructor(protected generalActions: PosGeneralActions, private notify: NotifyManager) { }
  
  ngOnInit() { }
  
  selectOutletAndRegister(outletId: number, registerId: number): void {
    if (this.pullState.isPullingChain) {
      this.notify.info('wait_until_data_pull_successfully');
      
      return;
    } else {
      this.generalActions.selectOutletRegister(outletId, registerId);
    }
  }
  
  getEnableOutletOrRegister(e: any, isList: boolean = true) {
    if (isList) {
      return e.filter((o) => o['is_active'] == 1)
              .sort((a, b) => a['name'].localeCompare(b['name']));
    }
    else {
      return _.chain(e)
              .filter((o) => o['is_active'] == 1)
              .sortBy('name')
              .value();
    }
  }
}
