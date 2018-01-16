import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosGeneralActions} from "../../../R/general/general.actions";
import {PosPullState} from "../../../R/entities/pull.state";
import {NotifyManager} from "../../../../../services/notify-manager";
import * as _ from 'lodash';
import {PosGeneralState} from "../../../R/general/general.state";

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
  
  constructor(protected generalActions: PosGeneralActions, private notify: NotifyManager) { }
  
  ngOnInit() { }
  
}
