import {List} from "immutable";
import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface PosPullState {
  isPullingChain: boolean;
  pullingEntity: string;
  pullingChain: List<string>;
  pullingChainSuccess: List<string>;
  pullingChainStarted: List<string>;
}

export interface PosPullStateRecord extends TypedRecord<any>, PosPullState {}

export const posPullStateFactory = makeTypedFactory<PosPullState, PosPullStateRecord>({
                                                                                        isPullingChain: false,
                                                                                        pullingEntity: '',
                                                                                        pullingChain: <any> List.of(),
                                                                                        pullingChainSuccess: <any> List.of(),
                                                                                        pullingChainStarted: <any> List.of()
                                                                                      });
