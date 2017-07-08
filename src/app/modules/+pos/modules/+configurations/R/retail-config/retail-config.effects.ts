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
import {EntityRetailConfigActions} from "../../../../R/entities/entity/retail-config.actions";

@Injectable()
export class RetailConfigEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private retailConfigActions: RetailConfigActions,
              private retailConfigService: RetailConfigService,
              private posConfigActions: PosConfigActions,
              private entityRetailConfigActions: EntityRetailConfigActions) { }
  
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
                                                  const config = data['items'][0];
                                                  return Observable.fromPromise(this.retailConfigService.saveRetailConfigToDB(config))
                                                                   .flatMap(() => Observable.from(
                                                                     [
                                                                       this.retailConfigActions.saveRetailConfigSuccess(config['key'], config['value'], false),
                                                                       this.posConfigActions.initPosRetailConfig(config['value'], false),
                                                                       this.entityRetailConfigActions.updateRetailConfig(config, false)
                                                                     ]))
                                                                   .catch(() => Observable.of(this.retailConfigActions.saveRetailConfigFailed('save_config_failed')));
                                                })
                                                .catch(() => Observable.of(this.retailConfigActions.saveRetailConfigFailed('save_config_failed_from_server')));
                                   });
  
}
