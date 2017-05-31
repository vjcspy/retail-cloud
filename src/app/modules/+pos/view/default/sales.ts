import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {PosEntitiesActions} from "../../R/entities/entities.actions";
import {FakeService} from "../../services/fake";
import {posViewReducer} from "../R/index";

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
              protected fakeService: FakeService) {
    this.store.replaceReducer(posViewReducer);
  }
  
  ngOnInit(): void {
    this.fake();
  }
  
  protected fake() {
    this.fakeService.fakeGeneralData();
  }
}
