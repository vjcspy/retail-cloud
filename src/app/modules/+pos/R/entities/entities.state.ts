import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {entityFactory, EntityRecord, outletEntityFactory, retailConfigEntityFactory, storeEntityFactory} from "./entities.model";
import {ProductDB} from "../../database/xretail/db/product";
import {CustomerDB} from "../../database/xretail/db/customer";
import {List} from "immutable";
import {PaymentDB} from "../../database/xretail/db/payment";
import {ReceiptDB} from "../../database/xretail/db/receipt";
import {SettingDB} from "../../database/xretail/db/setting";
import {TaxDB} from "../../database/xretail/db/tax";
import {CountryDB} from "../../database/xretail/db/country";
import {CustomerGroupDB} from "../../database/xretail/db/customer-group";
import {TaxClassDB} from "../../database/xretail/db/tax-class";
import {ShiftDB} from "../../database/xretail/db/shift";
import {UserOrderCountDB} from "../../database/xretail/db/user-order-count";
import {OrderDB} from "../../database/xretail/db/order";

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
                                typeId: "",
                                visibility: "",
                                status: 0,
                                productIds: "1,2,3,4,5,9,10,23,51,26,29,32,21,22,24,67,52,55,58,61,64,53,56,59,62,65,54,57,60,63,2046"
                              },
                              query: "",
                              needRealTime: true,
                              proportion: 2,
                              itemFiltered: List.of()
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
                               needRealTime: true,
                               proportion: 2
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
    outlet: outletEntityFactory(),
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
    stores: storeEntityFactory(),
    retailConfig: retailConfigEntityFactory(),
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
                            pageSize: 50,
                            items: List.of(),
                            apiUrlCode: ShiftDB.getCode(),
                            isFinished: false,
                            isDependStore: false,
                            query: "",
                            propertyFilter: {},
                            limitPage: 1
                          }),
    orders: entityFactory({
                            entityCode: OrderDB.getCode(),
                            currentPage: 0,
                            pageSize: 20,
                            items: List.of(),
                            apiUrlCode: OrderDB.getCode(),
                            isFinished: false,
                            isDependStore: false,
                            query: "",
                            propertyFilter: {},
                            limitPage: 1
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
