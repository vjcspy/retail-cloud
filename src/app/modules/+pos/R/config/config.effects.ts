import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosEntitiesActions} from "../entities/entities.actions";
import {SettingDB} from "../../database/xretail/db/setting";
import {List} from "immutable";
import {TaxConfig} from "../../core/framework/tax/Model/TaxConfig";
import {RootActions} from "../../../../R/root.actions";
import {PosConfigActions} from "./config.actions";
import {CustomerSetting} from "../../core/framework/setting/CustomerSetting";
import {ProductSetting} from "../../core/framework/setting/ProductSetting";
import {ShippingSetting} from "../../core/framework/setting/ShippingSetting";
import {TaxDB} from "../../database/xretail/db/tax";

@Injectable()
export class PosConfigEffects {
  
  constructor(private store$: Store<any>, private actions: Actions) { }
  
  @Effect() initPosSettings = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                  .filter((action: Action) => action.payload['entityCode'] === SettingDB.getCode())
                                  .withLatestFrom(this.store$.select('entities'))
                                  .map(([action, entitiesState]) => {
                                    const settings: List<SettingDB> = entitiesState[SettingDB.getCode()].items;
                                    let tax                         = new TaxConfig();
                                    let customer                    = new CustomerSetting();
                                    let product                     = new ProductSetting();
                                    let shipping                    = new ShippingSetting();
                                    let taxConfig: SettingDB        = settings.find((s) => s['key'] === 'tax');
                                    let productConfig: SettingDB    = settings.find((s) => s['key'] === 'product');
                                    let shippingConfig: SettingDB   = settings.find((s) => s['key'] === 'shipping');
                                    let customerConfig: SettingDB   = settings.find((s) => s['key'] === 'customer');
    
                                    if (!taxConfig || !productConfig || !shippingConfig || !customerConfig) {
                                      return {type: RootActions.ACTION_ERROR, payload: {mess: "Can't get setting in initPosSettings"}};
                                    } else {
                                      TaxConfig.taxConfig    = taxConfig['value'];
                                      CustomerSetting.config = customerConfig['value'];
                                      ProductSetting.config  = productConfig['value'];
                                      ShippingSetting.config = productConfig['value'];
      
                                      // Init Setting for core
                                      SettingDB._SETTING = settings.toJS();
      
                                      return {type: PosConfigActions.ACTION_INIT_POS_SETTINGS, payload: {tax, customer, product, shipping}};
                                    }
                                  });
  
  @Effect() initTaxRatesForCore = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                      .filter((action: Action) => action.payload['entityCode'] === SettingDB.getCode())
                                      .withLatestFrom(this.store$.select('entities'))
                                      .map(([action, entitiesState]) => {
                                        const taxes: List<TaxDB> = entitiesState[TaxDB.getCode()].items;
                                        TaxDB._RATES             = taxes.toJS();
    
                                        return {type: RootActions.ACTION_NOTHING, payload: {mess: 'just save tax rate to core'}};
                                      });
}
