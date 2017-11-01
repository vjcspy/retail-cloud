import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {Action, Store} from "@ngrx/store";
import {PosConfigActions} from "../config.actions";
import {PosEntitiesActions} from "../../entities/entities.actions";
import {CountryDB} from "../../../database/xretail/db/country";
import {CountryHelper} from "../../../core/framework/directory/Helper/CountryHelper";
import {PosEntitiesState} from "../../entities/entities.state";
import {RootActions} from "../../../../../R/root.actions";
import {TaxClassDB} from "../../../database/xretail/db/tax-class";
import {TaxClassHelper} from "../../../core/framework/tax/Helper/TaxClass";
import {RetailConfigDB} from "../../../database/xretail/db/retail-config";
import {SettingDB} from "../../../database/xretail/db/setting";
import {List} from "immutable";
import {TaxConfig} from "../../../core/framework/tax/Model/TaxConfig";
import {CustomerSetting} from "../../../core/framework/setting/CustomerSetting";
import {ProductSetting} from "../../../core/framework/setting/ProductSetting";
import {ShippingSetting} from "../../../core/framework/setting/ShippingSetting";
import {StoreDB} from "../../../database/xretail/db/store";
import {StoreHelper} from "../../../core/framework/store/Helper/StoreHelper";
import {RealtimeActions} from "../../entities/realtime/realtime.actions";
import {OutletDB} from "../../../database/xretail/db/outlet";
import {OutletHelper} from "../../../core/framework/outlet/Helper/OutletHelper";

@Injectable()
export class AssignConfigCoreEffects {
  
  constructor(private store$: Store<any>,
              private configActions: PosConfigActions,
              private rootActions: RootActions,
              private actions$: Actions) { }
  
  @Effect() initPosSettings = this.actions$
                                  .ofType(
                                    PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS,
                                    RealtimeActions.ACTION_REALTIME_UPDATED_ENTITY_DB
                                  )
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
                                      return this.rootActions.error("Can't get setting in initPosSettings", null, false);
                                    } else {
                                      TaxConfig.taxConfig    = taxConfig['value'];
                                      CustomerSetting.config = customerConfig['value'];
                                      ProductSetting.config  = productConfig['value'];
                                      ShippingSetting.config = productConfig['value'];
      
                                      return this.configActions.initPosSetting({tax, customer, product, shipping}, false);
                                    }
                                  });
  
  @Effect() initPosRetailConfig = this.actions$
                                      .ofType(
                                        PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS
                                      )
                                      .filter((action) => action.payload['entityCode'] === RetailConfigDB.getCode())
                                      .withLatestFrom(this.store$.select('entities'))
                                      .map((z) => {
                                        const retailConfig = (z[1] as PosEntitiesState).retailConfig.items;
                                        return retailConfig.find((c) => c['key'] === 'pos');
                                      })
                                      .filter((posConfig) => !!posConfig)
                                      .map((posConfig) => this.configActions.initPosRetailConfig(posConfig['value'], false));
  
  @Effect() saveCountryData = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                  .filter((action: Action) => action.payload['entityCode'] === CountryDB.getCode())
                                  .withLatestFrom(this.store$.select('entities'))
                                  .map((z) => {
                                    CountryHelper.countries = (z[1] as PosEntitiesState).countries.items.toJS();
                                    return this.rootActions.nothing("Save country to core");
                                  });
  
  @Effect() saveTaxClassData = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                   .filter((action: Action) => action.payload['entityCode'] === TaxClassDB.getCode())
                                   .withLatestFrom(this.store$.select('entities'))
                                   .map((z) => {
                                     TaxClassHelper.taxClass = (z[1] as PosEntitiesState).taxClass.items.toJS();
                                     return this.rootActions.nothing("Save taxClass to core");
                                   });
  
  @Effect() saveStoreData = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                .filter((action: Action) => action.payload['entityCode'] === StoreDB.getCode())
                                .withLatestFrom(this.store$.select('entities'))
                                .map((z) => {
                                  StoreHelper.stores = (z[1] as PosEntitiesState).stores.items.toJS();
                                  return this.rootActions.nothing("Save store to core");
                                });
  @Effect() saveOutletData = this.actions$.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                .filter((action: Action) => action.payload['entityCode'] === OutletDB.getCode())
                                .withLatestFrom(this.store$.select('entities'))
                                .map((z) => {
                                  OutletHelper.outlets = (z[1] as PosEntitiesState).outlet.items.toJS();
                                  return this.rootActions.nothing("Save outlet to core");
                                });
}
