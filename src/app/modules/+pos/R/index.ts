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

export const R_POS_IMPORTS = [
  EffectsModule.run(PosQuoteEffects),
  EffectsModule.run(PosEntitiesEffects)
];

export const R_POS_PROVIDERS = [
  PosGeneralActions,
  PosGeneralService,
  
  PosEntitiesService,
  PosEntitiesActions,
  PosEntitiesEffects,
  
  PosQuoteEffects,
  PosQuoteActions
];

export interface PosState {
  general: PosGeneralState;
  entities: PosEntitiesState;
  quote: PosQuoteState;
}

export const posReducer = createReducer({
                                          general: generalReducer,
                                          quote: quoteReducer,
                                          entities: entitiesReducer
                                        });
