import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PosGeneralActions} from "../../R/general/general.actions";
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../code/AbstractSubscriptionComponent";
import {PosGeneralState} from "../../R/general/general.state";
import {PosEntitiesState} from "../../R/entities/entities.state";
import {Observable} from "rxjs";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-outlet-register',
             templateUrl: 'outlet-register.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOutletRegisterComponent extends AbstractSubscriptionComponent implements OnInit {
  protected generalState$: Observable<PosGeneralState>;
  protected entitiesState$: Observable<PosEntitiesState>;
  
  
  constructor(private generalActions: PosGeneralActions, private store$: Store<any>) {
    super();
    this.generalState$  = this.store$.select('general');
    this.entitiesState$ = this.store$.select('entities');
  }
  
  ngOnInit() {
    this.generalActions.needResolveUrls();
  }
}
