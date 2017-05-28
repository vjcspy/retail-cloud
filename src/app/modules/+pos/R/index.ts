import {quoteReducer} from "./quote/quote.reducer";
import {EffectsModule} from "@ngrx/effects";
import {QuoteEffects} from "./quote/quote.effects";
import {createReducer} from "../../../R/index";
import {QuoteActions} from "./quote/quote.actions";
import {entitiesReducer} from "./entities/entities.reducer";
import {EntitiesActions} from "./entities/entities.actions";
import {EntitiesEffects} from "./entities/entities.effects";
import {PosEntitiesState} from "./entities/entities.state";
import {PosQuoteState} from "./quote/quote.state";

export const R_POS_IMPORTS = [
  EffectsModule.run(QuoteEffects),
  EffectsModule.run(EntitiesEffects)
];

export const R_POS_PROVIDERS = [
  EntitiesActions,
  EntitiesEffects,
  
  QuoteEffects,
  QuoteActions
];

export interface PosState {
  entities: PosEntitiesState;
  quote: PosQuoteState;
}

export const posReducer = createReducer({
                                          quote: quoteReducer,
                                          entities: entitiesReducer
                                        });
