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

export const R_POS_IMPORTS = [
  EffectsModule.run(PosQuoteEffects),
  EffectsModule.run(PosEntitiesEffects),
  EffectsModule.run(PosPullEffects)
];

export const R_POS_PROVIDERS = [
  PosGeneralActions,
  PosGeneralService,
  
  PosEntitiesService,
  PosEntitiesActions,
  PosEntitiesEffects,
  
  PosQuoteEffects,
  PosQuoteActions,
  
  PosPullActions,
  PosPullEffects,
];

/*Ở đây là interface bởi vì trong component, service... chỉ lấy data chứ không được set*/
export interface PosState {
  general: PosGeneralState;
  entities: PosEntitiesState;
  quote: PosQuoteState;
  pull: PosPullState;
}

export const posReducer = createReducer({
                                          general: generalReducer,
                                          quote: quoteReducer,
                                          entities: entitiesReducer,
                                          pull: pullReducer
                                        });
