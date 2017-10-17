import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";
import {OptionInterface} from "../../../../code/contract/option-interface";

export interface PricingState {
  processing: boolean;
  types: List<OptionInterface>;
}

export interface PricingStateRecord extends PricingState, TypedRecord<any> {}

export const pricingStateFactory = makeTypedFactory<PricingState, PricingStateRecord>(
  {
    processing: false,
    types: List.of(...[
      {
        name: "Standard",
        value: 1
      },
      {
        name: "Premium",
        value: 2
      },
      {
        name: "Lifetime",
        value: 3
      }
    ])
  }
);
