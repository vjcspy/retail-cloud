import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../../../../R/entities/entities.actions";
import {RetailConfigDB} from "../../../../database/xretail/db/retail-config";
import {RetailConfigActions} from "./retail-config.actions";
import {PosEntitiesState} from "../../../../R/entities/entities.state";
import {RetailConfigService} from "./retail-config.service";

@Injectable()
export class RetailConfigEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private retailConfigActions: RetailConfigActions,
              private retailConfigService: RetailConfigService) { }
  
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
}
