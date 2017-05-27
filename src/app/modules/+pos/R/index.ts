import {quoteReducer, QuoteState} from "./quote/quote.reducer";
import {EffectsModule} from "@ngrx/effects";
import {QuoteEffects} from "./quote/quote.effects";
import {createReducer} from "../../main/R/index";
import {QuoteActions} from "./quote/quote.actions";

export interface PosState {
  quote: QuoteState;
}

export const R_POS_IMPORTS = [
  EffectsModule.run(QuoteEffects)
];

export const R_POS_PROVIDERS = [
  QuoteEffects,
  QuoteActions
];

export const posReducer = createReducer({
                                          quote: quoteReducer
                                        });
