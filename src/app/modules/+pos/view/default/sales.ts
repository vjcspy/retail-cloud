import {Component, OnInit} from '@angular/core';
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../R/entities/entities.actions";
import {FakeService} from "../../services/fake";
import {NotifyManager} from "../../../../services/notify-manager";
import {ProgressBarService} from "../../../share/provider/progess-bar";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales',
             templateUrl: 'sales.html'
           })
export class PosDefaultSalesPage implements OnInit {
  protected data = {
    action: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER,
    payload: {
      entityCode: 'products'
    }
  };
  
  constructor(protected store: Store<any>,
              protected fakeService: FakeService,
              protected posEntitiesActions: PosEntitiesActions,
              protected notifyManager: NotifyManager,
              protected progressBar: ProgressBarService) {
  }
  
  ngOnInit(): void {
    this.fake();
    this.progressBar.start();
    setInterval(() => this.progressBar.randomIncrements(), 1000);
  }
  
  protected fake() {
    this.fakeService.fakeGeneralData();
  }
}
