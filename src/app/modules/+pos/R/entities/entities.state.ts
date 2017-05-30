import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Entity, entityFactory, EntityRecord} from "./entities.model";
import {ProductDB} from "../../database/xretail/db/product";
import {CustomerDB} from "../../database/xretail/db/customer";
import {List} from "immutable";
import {OutletDB} from "../../database/xretail/db/outlet";

export interface PosEntitiesState {
  products?: EntityRecord;
  categories?: EntityRecord;
  customers?: EntityRecord;
  taxes?: EntityRecord;
  orders?: EntityRecord;
  payments?: EntityRecord;
  warehouse?: EntityRecord;
  countries?: EntityRecord;
  outlets?: EntityRecord;
  stores?: EntityRecord;
}

export interface PosEntitiesStateRecord extends TypedRecord<PosEntitiesStateRecord>, PosEntitiesState {}

export const posEntitiesStateFactory = makeTypedFactory<PosEntitiesState, PosEntitiesStateRecord>(
  {
    products: entityFactory({
                              entityCode: ProductDB.getCode(),
                              currentPage: 0,
                              pageSize: 100,
                              items: List.of(),
                              apiUrlCode: ProductDB.getCode(),
                              isFinished: false,
                              isDependStore: true,
                              propertyFilter: {
                                productIds: "",
                                typeId: "",
                                visibility: "",
                                status: 0
                              },
                              query: ""
                            }),
    customers: entityFactory({
                               entityCode: CustomerDB.getCode(),
                               currentPage: 0,
                               pageSize: 100,
                               items: List.of(),
                               apiUrlCode: CustomerDB.getCode(),
                               isFinished: false,
                               isDependStore: true,
                               query: "",
                               propertyFilter: {}
                             }),
    outlets: entityFactory({
                             entityCode: OutletDB.getCode(),
                             currentPage: 0,
                             pageSize: 100,
                             items: List.of(),
                             apiUrlCode: OutletDB.getCode(),
                             isFinished: false,
                             isDependStore: false,
                             query: "",
                             propertyFilter: {}
                           })
  }
);
