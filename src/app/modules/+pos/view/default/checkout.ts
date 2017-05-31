import {Component, OnInit} from '@angular/core';
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../R/entities/entities.actions";
import {FakeService} from "../../services/fake";
import {PosPullActions} from "../../R/entities/pull.actions";
import {NotifyManager} from "../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-checkout',
             templateUrl: 'checkout.html'
           })
export class PosDefaultCheckoutPage implements OnInit {
  protected data = {
    action: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER,
    payload: {
      entityCode: 'products'
    }
  };
  
  constructor(protected store: Store<any>,
              protected fakeService: FakeService,
              protected posEntitiesActions: PosEntitiesActions,
              protected posPullActions: PosPullActions,
              protected notifyManager: NotifyManager) {
  }
  
  ngOnInit(): void {
    this.fake();
    
    this.posEntitiesActions.initEntityFromLocalDB('products');
    this.notifyManager.success("OK");
  }
  
  protected dispatch() {
    this.store.dispatch({type: this.data['action'], payload: this.data['payload']});
  }
  
  protected fake() {
    this.fakeService.fakeGeneralData();
  }
  
  protected pullFull() {
    this.posPullActions.pullEntities(['customers', 'outlets', 'taxes', 'settings', 'countries']);
  }
}
