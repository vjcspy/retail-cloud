import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {OutletDB} from "../../../../database/xretail/db/outlet";
import {ConfigurationsOutletActions} from "./outlet.actions";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {ConfigurationsOutletService} from "./outlet.service";
import {Router} from "@angular/router";
import {List} from "immutable";
import * as _ from 'lodash';
import {StoreDB} from "../../../../database/xretail/db/store";
import {CountryDB} from "../../../../database/xretail/db/country";
import {ReceiptDB} from "../../../../database/xretail/db/receipt";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {Observable} from "rxjs/Observable";
import {EntityActions} from "../../../../R/entities/entity/entity.actions";
import {routerActions} from "@ngrx/router-store";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {ConfigurationsState} from "../index";
import {PosGeneralState} from "../../../../R/general/general.state";

@Injectable()
export class ConfigurationsOutletEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private configurationsOutletActions: ConfigurationsOutletActions,
              private outletService: ConfigurationsOutletService,
              private router: Router,
              private _routerActions: RouterActions,
              private notify: NotifyManager,
              private entityActions: EntityActions) { }
  
  @Effect() resolveOutletGrid = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                      ConfigurationsOutletActions.ACTION_UPDATE_OUTLET_FILTER,
                                      routerActions.UPDATE_LOCATION
                                    )
                                    .filter(() => this.router.isActive('pos/configurations/default/pos/outlet/grid', false))
                                    .filter((action: Action) => {
                                      return !!action.payload['entityCode'] ? action.payload['entityCode'] === OutletDB.getCode() : true;
                                    })
                                    .withLatestFrom(this.store$.select('entities'))
                                    .withLatestFrom(this.store$.select('configurations'), (z, z1) => [...z, z1])
                                    .filter((z) => (z[1] as PosEntitiesState).outlet.isFinished === true)
                                    .map((z) => {
                                      const outlets    = (z[1] as PosEntitiesState).outlet.items;
                                      const filterData = (z[2] as ConfigurationsState).outlets.filterData;
    
                                      return this.configurationsOutletActions.resolveOutlet(this.outletService.resolveFilterOutlets(outlets, filterData), false);
                                    });
  
  @Effect() isLoadedEditFormDepend = this.actions$
                                         .ofType(
                                           PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                         )
                                         .filter(() => this.router.isActive('pos/configurations/default/pos/outlet', false))
                                         .filter((action: Action) => {
                                           return !!action.payload['entityCode'] ?
                                             [
                                               OutletDB.getCode(),
                                               StoreDB.getCode(),
                                               CountryDB.getCode(),
                                               ReceiptDB.getCode()
                                             ]
                                               .indexOf(action.payload['entityCode']) > -1 : true;
                                         })
                                         .withLatestFrom(this.store$.select('entities'))
                                         .map((z) => {
                                           let isLoaded                          = false;
                                           const entitiesState: PosEntitiesState = <any>z[1];
    
                                           if (entitiesState.outlet.isFinished === true
                                               && entitiesState.stores.isFinished === true
                                               && entitiesState.receipts.isFinished === true
                                               && entitiesState.countries.isFinished === true) {
                                             isLoaded = true;
                                           }
    
                                           return this.configurationsOutletActions.loadedDependEditForm(isLoaded, false);
                                         });
  
  @Effect() resolveOutletEditForm = this.actions$
                                        .ofType(
                                          ConfigurationsOutletActions.ACTION_EDIT_OUTLET
                                        )
                                        .withLatestFrom(this.store$.select('entities'))
                                        .filter((z) => {
                                          return (z[1] as PosEntitiesState).outlet.isFinished === true;
                                        })
                                        .map((z) => {
                                          const outlets = (z[1] as PosEntitiesState).outlet.items;
                                          const id      = z[0].payload['id'];
                                          let outlet: Object;
                                          let registers = List.of();
                                          if (isNaN(id) || parseInt(id) === 0) {
                                            outlet = {};
                                          } else {
                                            const _outlet = outlets.find((o) => parseInt(id) === parseInt(o['id']));
                                            if (_outlet) {
                                              outlet    = Object.assign({}, _outlet);
                                              registers = List.of();
                                              _.forEach(_outlet['registers'], (reg) => {
                                                registers = registers.push(Object.assign({}, reg));
                                              });
                                            }
                                          }
                                          this.outletService.editOutletFormData = <any>{outlet, registers};
    
                                          return this.configurationsOutletActions.resolveEditOutletForm({outlet, registers}, false);
                                        });
  
  @Effect() saveOutlet = this.actions$
                             .ofType(
                               ConfigurationsOutletActions.ACTION_SAVE_OUTLET
                             )
                             .withLatestFrom(this.store$.select('general'))
                             .switchMap((z: any) => {
                               const action: Action                = z[0];
                               const generalState: PosGeneralState = z[1];
                               let outletData                      = action.payload['outlet'];
                               outletData['registers']             = action.payload['registers'];
    
                               if (!!outletData['id'] && !!generalState.outlet && parseInt(outletData['id']) === parseInt(generalState.outlet['id'])) {
                                 this.notify.error("outlet_in_use_can_not_save");
                                 return Observable.of(this.configurationsOutletActions.saveOutletFailed('save_outlet_failed', null, false));
                               }
    
                               return this.outletService.createSaveOutletRequest(outletData, <any>z[1])
                                          .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                          .switchMap((data) => {
                                            let outlet = new OutletDB();
                                            outlet.addData(data['items'][0]);
                                            return Observable.fromPromise(outlet.save(data['items'][0]))
                                                             .switchMap(() => {
                                                               this.notify.success("save_outlet_data_successfully");
                                                               this.outletService.editOutletFormData = <any>{outlet, registers: outlet['registers']};
                                                               return Observable.from([
                                                                                        this.configurationsOutletActions.saveOutletSuccess(data['items'][0], false),
                                                                                        this.entityActions.pushEntity(outlet, OutletDB.getCode(), 'id', false),
                                                                                      ]);
                                                             })
                                                             .catch((e) => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_outlet_failed', e, false)));
                                          })
                                          .catch((e) => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_outlet_failed_from_sv', e, false)));
                             });
  
  @Effect() editRegister = this.actions$
                               .ofType(
                                 ConfigurationsOutletActions.ACTION_EDIT_REGISTER
                               )
                               .map((z) => {
                                 const action                                      = z;
                                 const register                                    = action.payload['register'];
                                 this.outletService.editOutletFormData['register'] = register;
    
                                 return this.configurationsOutletActions.resolveEditOutletForm({register}, false);
                               });
  
  @Effect() saveRegister = this.actions$
                               .ofType(
                                 ConfigurationsOutletActions.ACTION_SAVE_REGISTER
                               )
                               .withLatestFrom(this.store$.select('general'))
                               .switchMap((z: any) => {
                                 const action: Action                = z[0];
                                 const register                      = action.payload['register'];
                                 const generalState: PosGeneralState = z[1];
    
                                 if (!!register['id'] && !!generalState.register && parseInt(register['id']) === parseInt(generalState.register['id'])) {
                                   this.notify.error("register_in_use_can_not_save");
                                   return Observable.of(this.configurationsOutletActions.saveOutletFailed('save_outlet_failed', null, false));
                                 }
    
                                 if (this.outletService.editOutletFormData.outlet && !!this.outletService.editOutletFormData.outlet['id']) {
                                   register['outlet_id'] = this.outletService.editOutletFormData.outlet['id'];
                                 }
                                 return this.outletService.createSaveRegister(register, <any>z[1])
                                            .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                            .switchMap((data) => {
                                              let outlet = new OutletDB();
                                              outlet.addData(data['items'][0]);
                                              return Observable.fromPromise(outlet.save(data['items'][0]))
                                                               .switchMap(() => {
                                                                 this.notify.success("save_register_data_successfully");
                                                                 this._routerActions.go('pos/configurations/default/pos/outlet/edit', outlet['id']);
                                                                 return Observable.from([
                                                                                          this.configurationsOutletActions.saveOutletSuccess(data['items'][0], false),
                                                                                          this.entityActions.pushEntity(outlet, OutletDB.getCode(), 'id', false),
                                                                                          
                                                                                        ]);
                                                               })
                                                               .catch((e) => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_register_outlet_failed', e, false)));
                                            })
                                            .catch((e) => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_register_outlet_failed_from_sv', e, false)));
                               });
  
  @Effect() deleteRegister = this.actions$
                                 .ofType(
                                   ConfigurationsOutletActions.ACTION_DELETE_REGISTER
                                 )
                                 .withLatestFrom(this.store$.select('general'))
                                 .switchMap((z) => {
                                   const action: Action = z[0];
                                   const register       = action.payload['register'];
                                   if (this.outletService.editOutletFormData.outlet && !!this.outletService.editOutletFormData.outlet['id']) {
                                     register['outlet_id'] = this.outletService.editOutletFormData.outlet['id'];
                                   }
                                   return this.outletService.createDeleteRegister(register, <any>z[1])
                                              .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                              .switchMap((data) => {
                                                let outlet = new OutletDB();
                                                outlet.addData(data['items'][0]);
                                                return Observable.fromPromise(outlet.save(data['items'][0]))
                                                                 .switchMap(() => {
                                                                   this.notify.success("delete_register_successfully");
                                                                   this._routerActions.go('pos/configurations/default/pos/outlet/edit', this.outletService.editOutletFormData.outlet['id']);
                                                                   return Observable.from([
                                                                                            this.configurationsOutletActions.saveOutletSuccess(data['items'][0], false),
                                                                                            this.entityActions.pushEntity(outlet, OutletDB.getCode(), 'id', false)
                                                                                          ]);
                                                                 })
                                                                 .catch((e) => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_register_outlet_failed', e, false)));
                                              })
                                              .catch((e) => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_register_outlet_failed_from_sv', e, false)));
                                 });
}
