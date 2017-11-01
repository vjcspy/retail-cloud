import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosGeneralActions} from "../../../R/general/general.actions";
import {PosPullState} from "../../../R/entities/pull.state";
import {NotifyManager} from "../../../../../services/notify-manager";
import * as _ from 'lodash';
import {AppStorage} from "../../../../../services/storage";
import {AuthenticateService} from "../../../../../services/authenticate";
import {OfflineService} from "../../../../share/provider/offline";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-outlet-register-outlets',
             templateUrl: 'outlets.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultOutletRegisterOutletsComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() pullState: PosPullState;
  
  constructor(protected generalActions: PosGeneralActions, private notify: NotifyManager,private storage: AppStorage,public authenticateService: AuthenticateService,
              public offline: OfflineService) { }
  
  ngOnInit() { }
  
  selectOutletAndRegister(outletId: number, registerId: number): void {
    if (this.pullState.isPullingChain) {
      this.notify.info('wait_until_data_pull_successfully');
      return;
    } else {
      if (this.authenticateService.userCan('access_to_connectpos')) {
        this.generalActions.selectOutletRegister(outletId, registerId);
      } else {
        this.notify.error("not_have_permission_to_access_to_connectpos");
      }
     
    }
  }
  
  getEnableOutletOrRegister(e: any, isList: boolean = true) {
    let $listOutlet;
    if (!!this.storage.localRetrieve('outlets')) {
      $listOutlet = this.storage.localRetrieve('outlets');
    } else {
      $listOutlet = this.storage.localRetrieve('user')['outlet'];
    }
    if (isList) {
      return e.filter((o) => (o['is_active'] == 1 && _.indexOf($listOutlet, o['id']) != -1))
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
