import {quoteReducer} from "./quote/quote.reducer";
import {EffectsModule} from "@ngrx/effects";
import {QuoteEffects} from "./quote/quote.effects";
import {createReducer} from "../../../R/index";
import {QuoteActions} from "./quote/quote.actions";
import {entitiesReducer, EntitiesState} from "./entities/entities.reducer";
import {EntitiesActions} from "./entities/entities.actions";
import {EntitiesEffects} from "./entities/entities.effects";
import {QuoteState} from "./quote/quote.state";

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
  entities: EntitiesState;
  quote: QuoteState;
}

export const posReducer = createReducer({
                                          quote: quoteReducer,
                                          entities: entitiesReducer
                                        });
