import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosGeneralActions} from "./general.actions";
import {PosEntitiesState} from "../entities/entities.state";
import {OutletDB} from "../../database/xretail/db/outlet";
import {List} from "immutable";
import {Observable} from "rxjs";
import {RootActions} from "../../../../R/root.actions";
import {StoreDB} from "../../database/xretail/db/store";
import * as _ from 'lodash';
import {PosGeneralService} from "./general.service";
import {PosEntitiesActions} from "../entities/entities.actions";
import {RetailConfigDB} from "../../database/xretail/db/retail-config";

@Injectable()
export class PosGeneralEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private generalService: PosGeneralService,
              private rootActions: RootActions) { }
  
  @Effect() saveOutletAndRegister = this.actions$
                                        .ofType(PosGeneralActions.ACTION_SELECT_OUTLET_REGISTER)
                                        .withLatestFrom(this.store$.select('entities'))
                                        .map((z) => {
                                          const outletId                   = z[0].payload['outletId'];
                                          const entities: PosEntitiesState = z[1];
                                          const outlets: List<OutletDB>    = entities.outlet.items;
    
                                          const outlet = outlets.find((o) => parseInt(o['id'] + '') === parseInt(outletId + ''));
    
                                          if (!outlet) {
                                            Observable.throw(new Error("Can't find outlet when saveOutletAndRegister"));
                                          }
                                          const storeId               = outlet['store_id'];
                                          const stores: List<StoreDB> = entities.stores.items;
                                          const store                 = stores.find((o) => parseInt(o['id'] + '') === parseInt(storeId + ''));
    
                                          if (!store) {
                                            Observable.throw(new Error("Can't find store when saveOutletAndRegister"));
                                          }
    
                                          const registerId       = z[0].payload['registerId'];
                                          const registers: any[] = outlet['registers'];
    
                                          const register = _.find(registers, (o) => parseInt(o['id'] + '') === parseInt(registerId + ''));
    
                                          if (!register) {
                                            Observable.throw(new Error("Can't find register when saveOutletAndRegister"));
                                          }
    
                                          return {outlet, store, register};
                                        })
                                        .switchMap((generalData) => Observable.fromPromise(this.generalService.saveGeneralDataToDB(generalData))
                                                                              .map(() => ({
                                                                                type: PosGeneralActions.ACTION_SAVE_STATE,
                                                                                payload: generalData
                                                                              }))
                                                                              .catch((e) => Observable.of(this.rootActions.error("", e,false))));
  
  @Effect() retrieveOutletRegisterFromDB = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                               .filter((action: Action) => action.payload['entityCode'] === RetailConfigDB.getCode())
                                               .withLatestFrom(this.store$.select('entities'))
                                               .map((z) => {
                                                 const orData = this.generalService.retrieveOutletRegister((z[1] as PosEntitiesState).retailConfig);
                                                 if (orData) {
                                                   return {type: PosGeneralActions.ACTION_SAVE_STATE, payload: orData};
                                                 } else
                                                   return {type: RootActions.ACTION_NOTHING, payload: {mess: "No data outlet register in DB"}};
                                               });
}
