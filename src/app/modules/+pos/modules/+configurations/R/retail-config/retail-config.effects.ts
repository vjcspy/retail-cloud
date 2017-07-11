import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {RetailConfigDB} from "../../../../database/xretail/db/retail-config";
import {RetailConfigActions} from "./retail-config.actions";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {RetailConfigService} from "./retail-config.service";
import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";
import {PosConfigActions} from "../../../../R/config/config.actions";
import {Router} from "@angular/router";
import {EntityActions} from "../../../../R/entities/entity/entity.actions";

@Injectable()
export class RetailConfigEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private retailConfigActions: RetailConfigActions,
              private retailConfigService: RetailConfigService,
              private posConfigActions: PosConfigActions,
              private entityActions: EntityActions) { }
  
  @Effect() checkLoadedDepend = this.actions$
                                    .ofType(
                                      PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                    )
                                    .filter(() => this.router.isActive('pos/configurations/default/pos', false))
                                    .withLatestFrom(this.store$.select('entities'))
                                    .map((z) => {
                                      let productCategory = false;
                                      let customer        = false;
    
                                      const entitiesState: PosEntitiesState = <any>z[1];
    
                                      if (entitiesState.retailConfig.isFinished === true
                                          && entitiesState.taxClass.isFinished === true
                                          && entitiesState.settings.isFinished === true) {
                                        productCategory = true;
                                      }
                                      if (entitiesState.retailConfig.isFinished === true
                                          && entitiesState.countries.isFinished === true) {
                                        customer = true;
                                      }
                                      return this.retailConfigActions.isLoadedDepend({productCategory, customer});
                                    });
  
  @Effect() saveRetailConfigSnapShot = this.actions$
                                           .ofType(
                                             PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                           )
                                           .filter((action) => action.payload['entityCode'] === RetailConfigDB.getCode())
                                           .withLatestFrom(this.store$.select('entities'))
                                           .map((z) => {
                                             let retailConfig = {};
                                             (z[1] as PosEntitiesState).retailConfig.items.forEach((config) => {
                                               retailConfig[config['key']] = config['value'];
                                             });
    
                                             this.retailConfigService.retailConfigSnapshot = retailConfig;
                                             return this.retailConfigActions.saveRetailConfigSnapshot(retailConfig, false);
                                           });
  
  @Effect() saveRetailConfig = this.actions$
                                   .ofType(
                                     RetailConfigActions.ACTION_SAVE_RETAIL_CONFIG
                                   )
                                   .withLatestFrom(this.store$.select('general'))
                                   .switchMap((z) => {
                                     const action: Action = <any>z[0];
                                     return this.retailConfigService.createSaveRetailConfigRequest(action.payload['group'], action.payload['data'], <any>z[1])
                                                .filter((data) => data.hasOwnProperty('items') && !_.isEmpty(data['items']))
                                                .flatMap((data) => {
                                                  let config = new RetailConfigDB();
                                                  config.addData(data['items'][0]);
                                                  return Observable.fromPromise(this.retailConfigService.saveRetailConfigToDB(config))
                                                                   .flatMap(() => Observable.from(
                                                                     [
                                                                       this.retailConfigActions.saveRetailConfigSuccess(config['key'], config['value'], false),
                                                                       this.posConfigActions.initPosRetailConfig(config['value'], false),
                                                                       this.entityActions.pushEntity(config, RetailConfigDB.getCode(), 'key', false)
                                                                     ]))
                                                                   .catch(() => Observable.of(this.retailConfigActions.saveRetailConfigFailed('save_config_failed')));
                                                })
                                                .catch(() => Observable.of(this.retailConfigActions.saveRetailConfigFailed('save_config_failed_from_server')));
                                   });
  
}
