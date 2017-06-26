import {Component, Input, OnInit} from '@angular/core';
import {PosEntitiesState} from "../../../R/entities/entities.state";
import {PosGeneralActions} from "../../../R/general/general.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-outlet-register-outlets',
             templateUrl: 'outlets.component.html'
           })
export class PosDefaultOutletRegisterOutletsComponent implements OnInit {
  @Input() entitiesState: PosEntitiesState;
  
  constructor(protected generalActions: PosGeneralActions) { }
  
  ngOnInit() { }
  
  selectOutletAndRegister(outletId: number, registerId: number): void {
    this.generalActions.selectOutletRegister(outletId, registerId);
  }
}
