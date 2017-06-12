import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export enum RewardPointType{
  AheadWorld = 1,
  MageStore
}

export interface IntegrateRpState {
  isIntegrate: boolean;
  rpType: number;
  isUsingPoint: boolean;
  rpData: Object;
}

export interface IntegrateRpStateRecord extends TypedRecord<any>, IntegrateRpState {}

export const integrateRpStateFactory = makeTypedFactory<IntegrateRpState, IntegrateRpStateRecord>(
  {
    isIntegrate: false,
    rpType: RewardPointType.AheadWorld,
    isUsingPoint: false,
    rpData: {}
  });
