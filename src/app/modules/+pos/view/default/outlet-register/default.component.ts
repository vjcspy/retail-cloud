import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosGeneralActions} from "../../../R/general/general.actions";
import {PosPullState} from "../../../R/entities/pull.state";
import {NotifyManager} from "../../../../../services/notify-manager";
import {PosGeneralState} from "../../../R/general/general.state";
import {AccountState} from "../../../../../R/account/account.state";
import {AccountActions} from "../../../../../R/account/account.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-outlet-register',
             templateUrl: 'default.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultOutletRegisterDefaultComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  @Input() pullState: PosPullState;
  @Input() generalState: PosGeneralState;
  @Input() accountState: AccountState;
  
  constructor(protected generalActions: PosGeneralActions,
              private notify: NotifyManager,
              public accountActions: AccountActions) { }
  
  ngOnInit() { }
  
  hasCposPermission() {
    return this.accountState.cposPermission;
  }
  
}
