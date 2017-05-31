import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {Entity, entityFactory, EntityRecord} from "./entities.model";
import {ProductDB} from "../../database/xretail/db/product";
import {CustomerDB} from "../../database/xretail/db/customer";
import {List} from "immutable";
import {OutletDB} from "../../database/xretail/db/outlet";
import {PaymentDB} from "../../database/xretail/db/payment";
import {ReceiptDB} from "../../database/xretail/db/receipt";
import {SettingDB} from "../../database/xretail/db/setting";
import {TaxDB} from "../../database/xretail/db/tax";
import {CountryDB} from "../../database/xretail/db/country";
import {StoreDB} from "../../database/xretail/db/store";
import {RetailConfigDB} from "../../database/xretail/db/retail-config";
import {CustomerGroupDB} from "../../database/xretail/db/customer-group";
import {TaxClassDB} from "../../database/xretail/db/tax-class";
import {ShiftDB} from "../../database/xretail/db/shift";
import {UserOrderCountDB} from "../../database/xretail/db/user-order-count";

export interface PosEntitiesState {
  products?: EntityRecord;
  categories?: EntityRecord;
  customers?: EntityRecord;
  taxes?: EntityRecord;
  orders?: EntityRecord;
  payment?: EntityRecord;
  warehouse?: EntityRecord;
  countries?: EntityRecord;
  outlet?: EntityRecord;
  stores?: EntityRecord;
  receipts?: EntityRecord;
  settings?: EntityRecord;
  retailConfig?: EntityRecord;
  customerGroup?: EntityRecord;
  taxClass?: EntityRecord;
  shifts?: EntityRecord;
  userOrderCount?: EntityRecord;
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
                              query: "",
                              needRealTime: true
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
                               propertyFilter: {},
                               needRealTime: true
                             }),
    taxes: entityFactory({
                           entityCode: TaxDB.getCode(),
                           currentPage: 0,
                           pageSize: 100,
                           items: List.of(),
                           apiUrlCode: TaxDB.getCode(),
                           isFinished: false,
                           isDependStore: false,
                           query: "",
                           propertyFilter: {},
                           needRealTime: true
                         }),
    outlet: entityFactory({
                             entityCode: OutletDB.getCode(),
                             currentPage: 0,
                             pageSize: 100,
                             items: List.of(),
                             apiUrlCode: OutletDB.getCode(),
                             isFinished: false,
                             isDependStore: false,
                             query: "",
                             propertyFilter: {}
                           }),
    payment: entityFactory({
                              entityCode: PaymentDB.getCode(),
                              currentPage: 0,
                              pageSize: 100,
                              items: List.of(),
                              apiUrlCode: PaymentDB.getCode(),
                              isFinished: false,
                              isDependStore: false,
                              query: "",
                              propertyFilter: {}
                            }),
    receipts: entityFactory({
                              entityCode: ReceiptDB.getCode(),
                              currentPage: 0,
                              pageSize: 100,
                              items: List.of(),
                              apiUrlCode: ReceiptDB.getCode(),
                              isFinished: false,
                              isDependStore: false,
                              query: "",
                              propertyFilter: {}
                            }),
    settings: entityFactory({
                              entityCode: SettingDB.getCode(),
                              currentPage: 0,
                              pageSize: 100,
                              items: List.of(),
                              apiUrlCode: SettingDB.getCode(),
                              isFinished: false,
                              isDependStore: false,
                              query: "",
                              propertyFilter: {}
                            }),
    countries: entityFactory({
                               entityCode: CountryDB.getCode(),
                               currentPage: 0,
                               pageSize: 100,
                               items: List.of(),
                               apiUrlCode: CountryDB.getCode(),
                               isFinished: false,
                               isDependStore: false,
                               query: "",
                               propertyFilter: {}
                             }),
    stores: entityFactory({
                            entityCode: StoreDB.getCode(),
                            currentPage: 0,
                            pageSize: 100,
                            items: List.of(),
                            apiUrlCode: StoreDB.getCode(),
                            isFinished: false,
                            isDependStore: false,
                            query: "",
                            propertyFilter: {}
                          }),
    retailConfig: entityFactory({
                                  entityCode: RetailConfigDB.getCode(),
                                  currentPage: 0,
                                  pageSize: 100,
                                  items: List.of(),
                                  apiUrlCode: RetailConfigDB.getCode(),
                                  isFinished: false,
                                  isDependStore: false,
                                  query: "",
                                  propertyFilter: {
                                    group: "pos,warehouse"
                                  }
                                }),
    customerGroup: entityFactory({
                                   entityCode: CustomerGroupDB.getCode(),
                                   currentPage: 0,
                                   pageSize: 100,
                                   items: List.of(),
                                   apiUrlCode: CustomerGroupDB.getCode(),
                                   isFinished: false,
                                   isDependStore: false,
                                   query: "",
                                   propertyFilter: {}
                                 }),
    taxClass: entityFactory({
                              entityCode: TaxClassDB.getCode(),
                              currentPage: 0,
                              pageSize: 100,
                              items: List.of(),
                              apiUrlCode: TaxClassDB.getCode(),
                              isFinished: false,
                              isDependStore: false,
                              query: "",
                              propertyFilter: {}
                            }),
    shifts: entityFactory({
                            entityCode: ShiftDB.getCode(),
                            currentPage: 0,
                            pageSize: 100,
                            items: List.of(),
                            apiUrlCode: ShiftDB.getCode(),
                            isFinished: false,
                            isDependStore: false,
                            query: "",
                            propertyFilter: {}
                          }),
    userOrderCount: entityFactory({
                                    entityCode: UserOrderCountDB.getCode(),
                                    currentPage: 0,
                                    pageSize: 100,
                                    items: List.of(),
                                    apiUrlCode: UserOrderCountDB.getCode(),
                                    isFinished: false,
                                    isDependStore: false,
                                    query: "",
                                    propertyFilter: {}
                                  })
  }
);
