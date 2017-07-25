import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {EntityCustomerActions} from "./customer.actions";
import {EntityCustomerService} from "./customer.service";
import {NotifyManager} from "../../../../../services/notify-manager";

@Injectable()
export class EntityCustomerEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private entityCustomerService: EntityCustomerService,
              private notify: NotifyManager,
              private entityCustomerActions: EntityCustomerActions) { }
  
  @Effect() saveCustomerAddress = this.actions$
                                      .ofType(
                                        EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS
                                      )
                                      .filter((action) => {
                                        if (!!action.payload['customer'] && !!action.payload['customer']['id']) {
                                          return true;
                                        } else {
                                          this.notify.error("Please select customer when save address");
      
                                          return false;
                                        }
                                      })
                                      .withLatestFrom(this.store$.select('general'))
                                      .switchMap((z: any) => {
                                        const action: Action = z[0];
                                        let address          = action.payload['address'];
                                        const customer       = action.payload['customer'];
    
                                        address['parent_id'] = action.payload['customer']['id'];
    
                                        return this.entityCustomerService.createSaveAddressRequest(action.payload['address'], z[1])
                                                   .map((newAdd) => {
                                                     return this.entityCustomerActions.saveCustomerAddressSuccessfully(customer, newAdd, false);
                                                   });
                                      });
}
