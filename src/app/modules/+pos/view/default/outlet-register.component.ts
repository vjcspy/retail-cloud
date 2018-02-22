import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AbstractSubscriptionComponent} from "../../../../code/AbstractSubscriptionComponent";
import {PosGeneralState} from "../../R/general/general.state";
import {PosEntitiesState} from "../../R/entities/entities.state";
import {Observable} from "rxjs";
import {AccountService} from "../../../../R/account/account.service";
import {PosPullState} from "../../R/entities/pull.state";
import {TutorialService} from "../../modules/+tutorial/tutorial.service";
import {AccountState} from "../../../../R/account/account.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-outlet-register',
             templateUrl: 'outlet-register.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOutletRegisterComponent extends AbstractSubscriptionComponent implements OnInit {
  protected generalState$: Observable<PosGeneralState>;
  protected entitiesState$: Observable<PosEntitiesState>;
  protected pullState$: Observable<PosPullState>;
  protected accountState$: Observable<AccountState>;
  
  constructor(private store$: Store<any>, private accountService: AccountService, private tourService: TutorialService) {
    super();
    this.generalState$  = this.store$.select('general');
    this.entitiesState$ = this.store$.select('entities');
    this.pullState$     = this.store$.select('pull');
    this.accountState$  = this.store$.select('account');
  }
  
  ngOnInit() {
    this.subscribeObservable('urls', () => this.accountService.subscribeLicense(true));
    setTimeout(() => {
      if (this.tourService.tour.getCurrentStep() === 12) {
        this.tourService.tour.resume();
        this.tourService.tour.next();
      }
    }, 100);
  }
}
