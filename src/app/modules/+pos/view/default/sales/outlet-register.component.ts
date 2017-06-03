import {Component, OnInit} from '@angular/core';
import {PosPullActions} from "../../../R/entities/pull.actions";
import {PosGeneralActions} from "../../../R/general/general.actions";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {PosGeneralState} from "../../../R/general/general.state";
import {PosEntitiesState} from "../../../R/entities/entities.state";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-outlet-register',
             templateUrl: 'outlet-register.component.html'
           })
export class PosDefaultSalesOutletRegisterComponent extends AbstractSubscriptionComponent implements OnInit {
  protected entitiesState$: PosEntitiesState;
  
  constructor(private pullActions: PosPullActions, private generalActions: PosGeneralActions, private store$: Store<any>, private router: Router) {
    super();
    this.entitiesState$ = this.store$.select('entities');
  }
  
  ngOnInit() {
    
    this.subscribeObservable("check_outlet_register", () => this.store$
                                                                .select('general')
                                                                .subscribe((generalState: PosGeneralState) => {
                                                                  if (!!generalState.register['id'] && !!generalState.outlet['id'] && !!generalState.store['id']) {
                                                                    this.router.navigate(['pos/default/sales/checkout']);
                                                                  } else {
                                                                    this.pullActions
                                                                        .pullEntities([
                                                                                        'stores',
                                                                                        'outlet',
                                                                                        'retailConfig'
                                                                                      ]);
                                                                  }
                                                                }));
  }
  
  protected selectOutletAndRegister(outletId: number, registerId: number): void {
    this.generalActions.selectOutletRegister(outletId, registerId);
  }
}
