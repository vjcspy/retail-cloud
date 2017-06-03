import {Component, OnInit} from '@angular/core';
import {PosPullActions} from "../../../R/entities/pull.actions";
import {PosGeneralActions} from "../../../R/general/general.actions";
import {Store} from "@ngrx/store";
import {PosState} from "../../../R/index";
import {Entity} from "../../../R/entities/entities.model";
import {Router} from "@angular/router";
import {AbstractSubscriptionComponent} from "../../../../../code/AbstractSubscriptionComponent";
import {PosGeneralService} from "../../../R/general/general.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-outlet-register',
             templateUrl: 'outlet-register.component.html'
           })
export class PosDefaultSalesOutletRegisterComponent extends AbstractSubscriptionComponent implements OnInit {
  constructor(private pullActions: PosPullActions, private generalActions: PosGeneralActions, private store$: Store<any>, private router: Router, private generalService: PosGeneralService) {
    super();
  }
  
  ngOnInit() {
    this.pullActions.pullEntities([
                                    'stores',
                                    'outlet',
                                    'retailConfig', // Có save lại outlet/register đã chọn
                                  ]);
    
    // this.subscribeObservable("check_outlet_register", () => this.store$
    //                                                             .map((state: PosState) => state.entities.retailConfig)
    //                                                             .distinctUntilChanged()
    //                                                             .subscribe((retailConfig: Entity) => {
    //                                                               if (!!this.generalService.retrieveOutletRegister(retailConfig)) {
    //                                                                 this.router.navigate(['pos/default/sales/checkout']);
    //                                                               }
    //                                                             }));
  }
  
  protected selectOutletAndRegister(outletId: number, registerId: number): void {
    this.generalActions.selectOutletRegister(outletId, registerId);
  }
}
