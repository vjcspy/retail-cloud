import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Entity} from "./entities.model";

export interface PosEntitiesState {
  products?: Entity;
  categories?: Entity;
  customers?: Entity;
  taxes?: Entity;
  orders?: Entity;
  payments?: Entity;
  warehouse?: Entity;
  countries?: Entity;
  outlets?: Entity;
  stores?: Entity;
}

export interface PosEntitiesStateRecord extends TypedRecord<PosEntitiesStateRecord>, PosEntitiesState {}

export const posEntitiesStateFactory = makeTypedFactory<PosEntitiesState, PosEntitiesStateRecord>({});
