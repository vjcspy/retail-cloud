import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {RegionDB} from "../../../../database/xretail/db/region";
import {OutletDB} from "../../../../database/xretail/db/outlet";
import {ConfigurationsRegionActions} from "./region.actions";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {ConfigurationsRegionService} from "./region.service";
import {Router} from "@angular/router";
import {List} from "immutable";
import * as _ from 'lodash';
import {NotifyManager} from "../../../../../../services/notify-manager";
import {Observable} from "rxjs/Observable";
import {EntityActions} from "../../../../R/entities/entity/entity.actions";
import {routerActions} from "@ngrx/router-store";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {ConfigurationsState} from "../index";
import {PosGeneralState} from "../../../../R/general/general.state";

@Injectable()
export class ConfigurationsRegionEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private configurationsRegionActions: ConfigurationsRegionActions,
              private regionService: ConfigurationsRegionService,
              private router: Router,
              private _routerActions: RouterActions,
              private notify: NotifyManager,
              private entityActions: EntityActions) { }
  
  @Effect() resolveOutletGrid = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                      ConfigurationsRegionActions.ACTION_UPDATE_REGION_FILTER,
                                      routerActions.UPDATE_LOCATION
                                    )
                                    .filter(() => this.router.isActive('pos/configurations/default/pos/region/grid', false))
                                    .filter((action: Action) => {
                                      return !!action.payload['entityCode'] ? action.payload['entityCode'] === RegionDB.getCode() : true;
                                    })
                                    .withLatestFrom(this.store$.select('entities'))
                                    .withLatestFrom(this.store$.select('configurations'), (z, z1) => [...z, z1])
                                    .filter((z) => (z[1] as PosEntitiesState).region.isFinished === true)
                                    .map((z) => {
                                      const regions    = (z[1] as PosEntitiesState).region.items;
                                      const filterData = (z[2] as ConfigurationsState).regions.filterData;
    
                                      return this.configurationsRegionActions.resolveRegion(this.regionService.resolveFilterRegion(regions, filterData), false);
                                    });
  
  @Effect() isLoadedEditFormDepend = this.actions$
                                         .ofType(
                                           PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                         )
                                         .filter(() => this.router.isActive('pos/configurations/default/pos/region', false))
                                         .filter((action: Action) => {
                                           return !!action.payload['entityCode'] ?
                                             [
                                               OutletDB.getCode(),
                                               RegionDB.getCode()
                                             ]
                                               .indexOf(action.payload['entityCode']) > -1 : true;
                                         })
                                         .withLatestFrom(this.store$.select('entities'))
                                         .map((z) => {
                                           let isLoaded                          = false;
                                           const entitiesState: PosEntitiesState = <any>z[1];
    
                                           if (entitiesState.region.isFinished === true
                                             && entitiesState.outlet.isFinished === true) {
                                             isLoaded = true;
                                           }
                                           return this.configurationsRegionActions.loadedDependEditForm(isLoaded, false);
                                         });
  
  @Effect() resolveRegionEditForm = this.actions$
                                        .ofType(
                                          ConfigurationsRegionActions.ACTION_EDIT_REGION
                                        )
                                        .withLatestFrom(this.store$.select('entities'))
                                        .filter((z) => {
                                          return (z[1] as PosEntitiesState).region.isFinished === true;
                                        })
                                        .map((z) => {
                                          const regions = (z[1] as PosEntitiesState).region.items;
                                          const id      = z[0].payload['id'];
                                          let region: Object;
                                          if (isNaN(id) || parseInt(id) === 0) {
                                            region = {};
                                          } else {
                                            const _region = regions.find((o) => parseInt(id) === parseInt(o['id']));
                                            if (_region) {
                                              region    = Object.assign({}, _region);
                                            }
                                          }
                                          this.regionService.editRegionFormData = region;
    
                                          return this.configurationsRegionActions.resolveEditRegionForm(region, false);
                                        });
  
  @Effect() saveRegion = this.actions$
                             .ofType(
                               ConfigurationsRegionActions.ACTION_SAVE_REGION
                             )
                             .withLatestFrom(this.store$.select('general'))
                             .switchMap((z: any) => {
                               const action: Action                = z[0];
                               const generalState: PosGeneralState = z[1];
                               let regionData                      = action.payload['region'];
    
                               if (!!regionData['id'] && !!generalState.region && parseInt(regionData['id']) === parseInt(generalState.region['id'])) {
                                 this.notify.error("outlet_in_use_can_not_save");
                                 return Observable.of(this.configurationsRegionActions.saveRegionFailed('save_region_failed', null, false));
                               }
    
                               return this.regionService.createSaveRegionRequest(regionData, <any>z[1])
                                          .filter((data) => data.hasOwnProperty('items') && _.size(data['items']) === 1)
                                          .switchMap((data) => {
                                            let region = new RegionDB();
                                            region.addData(data['items'][0]);
                                            return Observable.fromPromise(region.save(data['items'][0]))
                                                             .switchMap(() => {
                                                               this.notify.success("save_outlet_data_successfully");
                                                               // this.regionService.editRegionFormData = region;
                                                               this._routerActions.go('pos/configurations/default/pos/region/grid');
                                                               return Observable.from([
                                                                                        this.configurationsRegionActions.saveRegionSuccess(data['items'][0], false),
                                                                                        this.entityActions.pushEntity(region, RegionDB.getCode(), 'id', false),
                                                                                      ]);
                                                             })
                                                             .catch((e) => Observable.of(this.configurationsRegionActions.saveRegionFailed('save_outlet_failed', e, false)));
                                          })
                                          .catch((e) => Observable.of(this.configurationsRegionActions.saveRegionFailed('save_outlet_failed_from_sv', e, false)));
                             });
  
  @Effect() deleteRegion = this.actions$
                               .ofType(
                                 ConfigurationsRegionActions.ACTION_DELETE_REGION
                               )
                               .withLatestFrom(this.store$.select('general'))
                               .switchMap((z) => {
                                 const action: Action = z[0];
                                 const regionId       = action.payload['id'];
                                 return this.regionService.createDeleteRegionRequest(regionId, <any>z[1])
                                            .switchMap((data) => {
                                              // this.notify.success(data['messages']);
                                              let region = new RegionDB();
                                              return Observable.fromPromise(region.delete(regionId))
                                                               .switchMap(() => {
                                                                 this._routerActions.go('pos/configurations/default/pos/region/grid');
                                                                 return Observable.from([
                                                                                          this.configurationsRegionActions.deleteRegionSuccess(
                                                                                            regionId,
                                                                                            false),
                                                                                          this.entityActions.deleteEntity(regionId, RegionDB.getCode(),'id', false),
                                                                                        ]);
                                                               })
                                                               .catch((e) => Observable.of(this.configurationsRegionActions.deleteRegionFailed('save_outlet_failed', e, false)));
                                            })
                                            .catch((e) => Observable.of(this.configurationsRegionActions.deleteRegionFailed("delete_cache_instance_failed", e, false)));
                               });
  
}
