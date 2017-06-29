import {quoteReducer} from "./quote/quote.reducer";
import {EffectsModule} from "@ngrx/effects";
import {PosQuoteEffects} from "./quote/quote.effects";
import {createReducer} from "../../../R/index";
import {PosQuoteActions} from "./quote/quote.actions";
import {entitiesReducer} from "./entities/entities.reducer";
import {PosEntitiesActions} from "./entities/entities.actions";
import {PosEntitiesEffects} from "./entities/entities.effects";
import {PosEntitiesState} from "./entities/entities.state";
import {PosQuoteState} from "./quote/quote.state";
import {PosGeneralState} from "./general/general.state";
import {generalReducer} from "./general/general.reducer";
import {PosGeneralActions} from "./general/general.actions";
import {PosEntitiesService} from "./entities/entities.service";
import {PosGeneralService} from "./general/general.service";
import {PosPullState} from "./entities/pull.state";
import {pullReducer} from "./entities/pull.reducer";
import {PosPullActions} from "./entities/pull.actions";
import {PosPullEffects} from "./entities/pull.effects";
import {posConfigReducer} from "./config/config.reducer";
import {PosConfigState} from "./config/config.state";
import {PosQuoteService} from "./quote/quote.service";
import {PosGeneralEffects} from "./general/general.effects";
import {PosConfigEffects} from "./config/config.effects";
import {PosConfigActions} from "./config/config.actions";
import {PosAssignActions} from "./core/assign.actions";
import {PosAssignEffects} from "./core/assign.effects";
import {PosSyncEffects} from "./sync/sync.effects";
import {PosSyncService} from "./sync/sync.service";
import {PosSyncActions} from "./sync/sync.actions";
import {posSyncReducer} from "./sync/sync.reducer";
import {PosSyncState} from "./sync/sync.state";
import {IntegrateRpActions} from "./integrate/rp/integrate-rp.actions";
import {PosConfigService} from "./config/config.service";
import {QuoteItemEffects} from "./quote/item/item.effects";
import {QuoteItemActions} from "./quote/item/item.actions";
import {QuoteCustomerService} from "./quote/customer/customer.service";
import {RealtimeActions} from "./entities/realtime/realtime.actions";
import {RealtimeEffects} from "./entities/realtime/realtime.effects";
import {RealtimeService} from "./entities/realtime/realtime.service";
import {EntityOrderActions} from "./entities/entity/order.actions";

export const R_POS_IMPORTS = [
  EffectsModule.run(PosAssignEffects),
  EffectsModule.run(PosGeneralEffects),
  
  EffectsModule.run(PosEntitiesEffects),
  // EffectsModule.run(GeneralEntityEffects),
  EffectsModule.run(RealtimeEffects),
  
  EffectsModule.run(PosPullEffects),
  EffectsModule.run(PosQuoteEffects),
  EffectsModule.run(QuoteItemEffects),
  EffectsModule.run(PosConfigEffects),
  EffectsModule.run(PosSyncEffects),
];

export const R_POS_PROVIDERS = [
  PosAssignActions,
  PosAssignEffects,
  
  PosGeneralActions,
  PosGeneralService,
  PosGeneralEffects,
  
  PosEntitiesService,
  PosEntitiesActions,
  PosEntitiesEffects,
  // GeneralEntityEffects,
  // GeneralEntityService,
  // GeneralEntityActions,
  RealtimeActions,
  RealtimeEffects,
  RealtimeService,
  EntityOrderActions,
  
  PosQuoteService,
  PosQuoteEffects,
  PosQuoteActions,
  QuoteItemEffects,
  QuoteItemActions,
  QuoteCustomerService,
  
  PosPullActions,
  PosPullEffects,
  
  PosConfigActions,
  PosConfigEffects,
  PosConfigService,
  
  PosSyncEffects,
  PosSyncService,
  PosSyncActions,
  
  IntegrateRpActions,
];

/*Ở đây là interface bởi vì trong component, service... chỉ lấy data chứ không được set*/
export interface PosState {
  general: PosGeneralState;
  entities: PosEntitiesState;
  quote: PosQuoteState;
  pull: PosPullState;
  config: PosConfigState;
  sync: PosSyncState;
}

export const posReducer = createReducer({
                                          general: generalReducer,
                                          quote: quoteReducer,
                                          entities: entitiesReducer,
                                          pull: pullReducer,
                                          config: posConfigReducer,
                                          sync: posSyncReducer,
                                        });
