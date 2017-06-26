import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../entities/entities.actions";
import {SettingDB} from "../../database/xretail/db/setting";
import {List} from "immutable";
import {PosAssignActions} from "./assign.actions";
import {PosGeneralActions} from "../general/general.actions";
import {StoreDB} from "../../database/xretail/db/store";
import * as _ from 'lodash';
import {Store as CoreStore} from "../../core/framework/store/Model/Store";
import {StoreManager} from "../../core/framework/store/Model/StoreManager";
import {TaxDB} from "../../database/xretail/db/tax";

@Injectable()
export class PosAssignEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private assignActions: PosAssignActions) {}
  
  @Effect() assignSettingToCore = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                      .filter((action: Action) => action.payload['entityCode'] === SettingDB.getCode())
                                      .withLatestFrom(this.store$.select('entities'))
                                      .map(([action, entitiesState]) => {
                                        const settings: List<SettingDB> = entitiesState[SettingDB.getCode()].items;
    
                                        // Init Setting for core
                                        SettingDB._SETTING = settings.toJS();
    
                                        return this.assignActions.saveAssignedDataToCore(SettingDB.getCode(), false);
                                      });
  
  @Effect() assignCurrentStoreToCore = this.actions$.ofType(PosGeneralActions.ACTION_SAVE_STATE)
                                           .map((action: Action) => {
                                             _.forEach(action.payload['generalData'], (v, k) => {
                                               if (k === 'store') {
                                                 let store = new CoreStore();
                                                 StoreManager.setStore(store.mapWithParent(v));
                                               }
                                             });
                                             return this.assignActions.saveAssignedDataToCore(SettingDB.getCode(), false);
                                           });
  
  @Effect() assignTaxesToCore = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                    .filter((action: Action) => action.payload['entityCode'] === TaxDB.getCode())
                                    .withLatestFrom(this.store$.select('entities'))
                                    .map(([action, entitiesState]) => {
                                      const taxes: List<TaxDB> = entitiesState[TaxDB.getCode()].items;
                                      TaxDB._RATES             = taxes.toJS();
    
                                      return this.assignActions.saveAssignedDataToCore(SettingDB.getCode(), false);
                                    });
}
