import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../code/AbstractSubscriptionComponent";
import {PosGeneralState} from "../../R/general/general.state";
import {PosEntitiesState} from "../../R/entities/entities.state";
import {Observable} from "rxjs";
import {AccountService} from "../../../../R/account/account.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-outlet-register',
             templateUrl: 'outlet-register.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOutletRegisterComponent extends AbstractSubscriptionComponent implements OnInit {
  protected generalState$: Observable<PosGeneralState>;
  protected entitiesState$: Observable<PosEntitiesState>;
  
  
  constructor(private store$: Store<any>, private accountService: AccountService) {
    super();
    this.generalState$  = this.store$.select('general');
    this.entitiesState$ = this.store$.select('entities');
  }
  
  ngOnInit() {
    this.subscribeObservable('urls', () => this.accountService.subscribeLicense(true));
  }
}
