import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {EntityCustomerActions} from "./customer.actions";
import {EntityCustomerService} from "./customer.service";
import {NotifyManager} from "../../../../../services/notify-manager";
import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";
import {CustomerDB} from "../../../database/xretail/db/customer";
import {EntityActions} from "./entity.actions";
import {OfflineService} from "../../../../share/provider/offline";
import {PosEntitiesState} from "../entities.state";

@Injectable()
export class EntityCustomerEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private entityCustomerService: EntityCustomerService,
              private entityActions: EntityActions,
              private notify: NotifyManager,
              private offline: OfflineService,
              private entityCustomerActions: EntityCustomerActions) { }
  
  @Effect() saveCustomerAddress = this.actions$
                                      .ofType(
                                        EntityCustomerActions.ACTION_SAVE_CUSTOMER_ADDRESS
                                      )
                                      .filter((action) => {
                                        if (!!action.payload['customer']) {
                                          return true;
                                        } else {
                                          this.notify.error("Please select customer when save address");
      
                                          return false;
                                        }
                                      })
                                      .withLatestFrom(this.store$.select('general'))
                                      .withLatestFrom(this.store$.select('entities'), (z, z1) => [...z, z1])
                                      .switchMap((z: any) => {
                                        const action: Action = z[0];
                                        const address        = _.isObject(action.payload['address']) && _.size(action.payload['address']) > 0 ?
                                          action.payload['address'] : null;
                                        const customer       = action.payload['customer'];
                                        const addressType    = action.payload['addressType'];
    
                                        if (this.offline.online) {
                                          return this.entityCustomerService.createSaveCustomerAddressRequest(customer, address, addressType, z[1])
                                                     .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                                     .map((data) => data['items'][0])
                                                     .switchMap((c) => {
                                                       let customerDb = new CustomerDB();
                                                       customerDb.addData(c);
        
                                                       return Observable.fromPromise(customerDb.save(c))
                                                                        .switchMap(() => {
                                                                          this.notify.success("save_customer_successfully");
          
                                                                          return Observable.from([
                                                                                                   this.entityActions.pushEntity(customerDb, CustomerDB.getCode(), 'id', false),
                                                                                                   this.entityCustomerActions.saveCustomerAddressSuccessfully(customerDb, addressType, false)
                                                                                                 ]);
                                                                        });
                                                     })
                                                     .catch((e) => Observable.of(this.entityCustomerActions.saveCustomerAddressFailed('save_customer_failed', e, false)));
                                        } else {
                                          let customers = (z[2] as PosEntitiesState).customers.items;
                                          if (!customer['id']) {
                                            let isExisted = customers.findIndex((_c) => _c['email'] === customers['email']) > -1;
        
                                            if (isExisted) {
                                              return Observable.of(this.entityCustomerActions.saveCustomerAddressFailed('customer_email_existed', null, false));
                                            }
                                            customer['id'] = Date.now();
        
                                            return Observable.of(this.entityCustomerActions.saveCustomerAddressFailed('not_yet_support_create_new_customer_offline', null, false));
                                          }
      
                                          if (!customer.address) {
                                            customer.address = [];
                                          }
      
                                          if (address) {
                                            if (!address['id']) {
                                              address['id'] = Date.now();
                                              customer.address.push(address);
                                            } else {
                                              let index = _.findIndex(customer.address, {id: address['id']});
                                              customer.address.splice(index, 1, address);
                                            }
                                          }
      
      
                                          let customerDb = new CustomerDB();
                                          customerDb.addData(customer);
      
      
                                          return Observable.fromPromise(customerDb.save(customerDb))
                                                           .switchMap(() => {
                                                             this.notify.success("save_customer_successfully");
        
                                                             return Observable.from([
                                                                                      this.entityActions.pushEntity(customerDb, CustomerDB.getCode(), 'id', false),
                                                                                      this.entityCustomerActions.saveCustomerAddressSuccessfully(customerDb, addressType, false)
                                                                                    ]);
                                                           });
                                        }
                                      });
}
