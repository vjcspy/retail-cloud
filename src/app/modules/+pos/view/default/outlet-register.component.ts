import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PosGeneralActions} from "../../R/general/general.actions";
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../code/AbstractSubscriptionComponent";
import {LocalStorage} from "ngx-webstorage";
import {PosGeneralState} from "../../R/general/general.state";
import * as _ from 'lodash';
import {PosEntitiesState} from "../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-outlet-register',
             templateUrl: 'outlet-register.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOutletRegisterComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  protected generalState: PosGeneralState;
  protected entitiesState: PosEntitiesState;
  
  @LocalStorage()
  public baseUrl: string;
  
  constructor(private generalActions: PosGeneralActions, private store$: Store<any>, private ref: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this.subscribeObservable('generalChange', () => this.store$.select('general').subscribe((generalState: PosGeneralState) => {
      this.generalState = generalState;
      this.ref.detectChanges();
    }));
    this.subscribeObservable('entitiesChange', () => this.store$.select('entities').subscribe((entitiesState: PosEntitiesState) => {
                               this.entitiesState = entitiesState;
                               this.ref.detectChanges();
                             })
    );
    this.generalActions.needResolveUrls();
  }
  
  ngAfterViewInit(): void {
    if (_.isString(this.baseUrl)) {
      this.selectWebsite(this.baseUrl);
    }
  }
  
  protected selectOutletAndRegister(outletId: number, registerId: number): void {
    this.generalActions.selectOutletRegister(outletId, registerId);
  }
  
  selectWebsite($event) {
    console.log($event);
    if (_.isString($event)) {
      this.baseUrl = $event;
      this.generalActions.selectWebsite(this.baseUrl);
    }
  }
}
