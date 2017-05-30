import {Component, OnInit} from '@angular/core';
import {SlimLoadingBarService} from "ng2-slim-loading-bar";
import {Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../R/entities/entities.actions";
import {FakeService} from "../../services/fake";
import {PosPullActions} from "../../R/entities/pull.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-checkout',
             templateUrl: 'checkout.component.html'
           })
export class PosCheckoutComponent implements OnInit {
  protected data = {
    action: PosEntitiesActions.ACTION_PULL_ENTITY_DATA_FROM_SERVER,
    payload: {
      entityCode: 'products'
    }
  };
  
  constructor(protected store: Store<any>,
              protected fakeService: FakeService,
              protected posEntitiesActions: PosEntitiesActions,
              protected posPullActions: PosPullActions) {
  }
  
  ngOnInit(): void {
    this.fake();
    
    this.posEntitiesActions.initEntityFromLocalDB('products');
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
