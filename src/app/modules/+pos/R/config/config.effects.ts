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
import {UserOrderCountDB} from "../../database/xretail/db/user-order-count";
import {PosGeneralState} from "../general/general.state";
import {Observable} from "rxjs";
import {PosConfigService} from "./config.service";
import {ReceiptDB} from "../../database/xretail/db/receipt";
import {PosEntitiesState} from "../entities/entities.state";
import {CountryHelper} from "../../core/framework/directory/Helper/CountryHelper";
import {PosStepActions} from "../../view/R/sales/checkout/step/step.actions";
import {PosConfigState} from "./config.state";
import {TaxClassDB} from "../../database/xretail/db/tax-class";
import {TaxClassHelper} from "../../core/framework/tax/Helper/TaxClass";
import {RetailConfigDB} from "../../database/xretail/db/retail-config";

@Injectable()
export class PosConfigEffects {
  
  constructor(private store$: Store<any>,
              private actions: Actions,
              private configService: PosConfigService,
              private configActions: PosConfigActions,
              private rootActions: RootActions) { }
  
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
                                      return this.rootActions.error("Can't get setting in initPosSettings", null, false);
                                    } else {
                                      TaxConfig.taxConfig    = taxConfig['value'];
                                      CustomerSetting.config = customerConfig['value'];
                                      ProductSetting.config  = productConfig['value'];
                                      ShippingSetting.config = productConfig['value'];
      
                                      return this.configActions.initPosSetting({tax, customer, product, shipping}, false);
                                    }
                                  });
  
  @Effect() retrieveOrderCount = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                     .filter((action: Action) => action.payload['entityCode'] === UserOrderCountDB.getCode())
                                     .withLatestFrom(this.store$.select('entities'))
                                     .withLatestFrom(this.store$.select('general'),
                                                     ([action, entitiesState], generalState) => [action, entitiesState, generalState])
                                     .flatMap(([action, entitiesState, generalState]) => {
                                       const orderCounts: List<UserOrderCountDB> = entitiesState[UserOrderCountDB.getCode()].items;
    
                                       const orderCount = orderCounts.find((o: UserOrderCountDB) => o.register_id === (generalState as PosGeneralState).register['id']);
    
                                       if (!orderCount) {
                                         return Observable.fromPromise(this.configService.createNewOrderCount(generalState))
                                                          .map((_count) => {
                                                            return this.configActions.retrieveOrderCount(_count, false);
                                                          })
                                                          .catch(() => Observable.of(this.rootActions.error("Can't not create order offline count", null, false)));
                                       }
                                       return Observable.of(this.configActions.retrieveOrderCount(orderCount, false));
                                     });
  
  @Effect() increaseOrderCount = this.actions.ofType(PosStepActions.ACTION_SAVED_ORDER)
                                     .withLatestFrom(this.store$.select('config'))
                                     .withLatestFrom(this.store$.select('general'),
                                                     ([action, entitiesState], generalState) => [action, entitiesState, generalState])
                                     .flatMap(([action, configState, generalState]) => {
                                       const orderCount  = (configState as PosConfigState).orderCount;
                                       let newOrderCount = Object.assign({}, {...orderCount}, {order_count: parseInt(orderCount['order_count']) + 1});
    
                                       return Observable.fromPromise(this.configService.createNewOrderCount(generalState, newOrderCount))
                                                        .map((_count) => {
                                                          return this.configActions.retrieveOrderCount(_count, false);
                                                        })
                                                        .catch(() => Observable.of(this.rootActions.error("Can't not create order offline count", null, false)));
                                     });
  
  @Effect() retrieveReceipt = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                  .filter((action: Action) => action.payload['entityCode'] === ReceiptDB.getCode())
                                  .withLatestFrom(this.store$.select('entities'))
                                  .withLatestFrom(this.store$.select('general'),
                                                  ([action, entitiesState], generalState) => [action, entitiesState, generalState])
                                  .map(([action, entitiesState, generalState]) => {
                                    let receipt;
                                    receipt = (entitiesState as PosEntitiesState).receipts.items.find((r) => parseInt(r['id'] + '') === parseInt(generalState.outlet['paper_receipt_template_id'] + ''));
                                    if (!receipt) {
                                      receipt = (entitiesState as PosEntitiesState).receipts.items.find((r) => r['is_default'] === true);
                                    }
    
                                    return this.configActions.saveReceiptSetting(receipt);
                                  });
  
  @Effect() saveCountryData = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                  .filter((action: Action) => action.payload['entityCode'] === ReceiptDB.getCode())
                                  .withLatestFrom(this.store$.select('entities'))
                                  .map((z) => {
                                    CountryHelper.countries = (z[1] as PosEntitiesState).countries.items.toJS();
                                    return this.rootActions.nothing("Save country to core");
                                  });
  
  @Effect() saveTaxClassData = this.actions.ofType(PosEntitiesActions.ACTION_PULL_ENTITY_SUCCESS)
                                   .filter((action: Action) => action.payload['entityCode'] === TaxClassDB.getCode())
                                   .withLatestFrom(this.store$.select('entities'))
                                   .map((z) => {
                                     TaxClassHelper.taxClass = (z[1] as PosEntitiesState).taxClass.items.toJS();
                                     return this.rootActions.nothing("Save taxClass to core");
                                   });
  
  @Effect() initPosRetailConfig = this.actions
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
}
