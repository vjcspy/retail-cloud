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

@Injectable()
export class ConfigurationsOutletEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private configurationsOutletActions: ConfigurationsOutletActions,
              private outletService: ConfigurationsOutletService,
              private router: Router,
              private notify: NotifyManager) { }
  
  @Effect() resolveOutletGrid = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                      ConfigurationsOutletActions.ACTION_UPDATE_OUTLET_FILTER
                                    )
                                    .filter(() => this.router.isActive('pos/configurations/default/pos/outlet/grid', true))
                                    .filter((action: Action) => {
                                      return !!action.payload['entityCode'] ? action.payload['entityCode'] === OutletDB.getCode() : true;
                                    })
                                    .withLatestFrom(this.store$.select('entities'))
                                    .withLatestFrom(this.store$.select('configurations'), (z, z1) => [...z, z1])
                                    .map((z) => {
                                      const outlets    = (z[1] as PosEntitiesState).outlet.items;
                                      const filterData = <any>z[2].outlets.filterData;
    
                                      return this.configurationsOutletActions.resolveOutlet(this.outletService.resolveFilterOutlets(outlets, filterData), false);
                                    });
  
  @Effect() isLoadedEditFormDepend = this.actions$
                                         .ofType(
                                           PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                         )
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
                                          if (isNaN(id)) {
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
                                          this.outletService.editOutletFormData = {outlet, registers};
    
                                          return this.configurationsOutletActions.resolveEditOutletForm(outlet, registers, false);
                                        });
  
  @Effect() saveOutlet = this.actions$
                             .ofType(
                               ConfigurationsOutletActions.ACTION_SAVE_OUTLET
                             )
                             .withLatestFrom(this.store$.select('general'))
                             .switchMap((z) => {
                               const action: Action    = z[0];
                               let outletData          = action.payload['outlet'];
                               outletData['registers'] = action.payload['registers'];
    
                               return this.outletService.createSaveOutletRequest(outletData, <any>z[1])
                                          .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                          .switchMap((data) => {
                                            this.notify.success("save_outlet_data_successfully");
                                            let outlet = new OutletDB();
                                            return Observable.fromPromise(outlet.save(data['items'][0]))
                                                             .map(() => this.configurationsOutletActions.saveOutletSuccess(data['items'][0], false))
                                                             .catch(() => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_outlet_failed', false)));
                                          })
                                          .catch(() => Observable.of(this.configurationsOutletActions.saveOutletFailed('save_outlet_failed_from_sv', false)));
                             });
}
