import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";
import {OutletDB} from "../../database/xretail/db/outlet";
import {StoreDB} from "../../database/xretail/db/store";
import {RetailConfigDB} from "../../database/xretail/db/retail-config";

export interface Entity {
  items: List<any>;
  currentPage: number;
  query?: string;
  propertyFilter?: Object;
  pageSize: number;
  entityCode: string;
  apiUrlCode: string;
  entityPrimaryKey?: string;
  isFinished: boolean;
  isDependStore: boolean;
  needRealTime?: boolean;
  isLoadedFromDB?: boolean;
  proportion?: number;
  itemFiltered?: List<any>;
  limitPage?: number;
  additionData?: {
    lastPageNumber?: number;
    totalCount?: number;
    isLoadFromCache?: boolean;
  };
}
export interface EntityRecord extends TypedRecord<EntityRecord>, Entity {}

export const entityFactory       = makeTypedFactory<Entity, EntityRecord>({
                                                                            items: List.of(),
                                                                            currentPage: 0,
                                                                            query: "",
                                                                            propertyFilter: {},
                                                                            pageSize: 100,
                                                                            entityCode: null,
                                                                            apiUrlCode: null,
                                                                            entityPrimaryKey: 'id',
                                                                            isFinished: false,
                                                                            isDependStore: false,
                                                                            needRealTime: false,
                                                                            isLoadedFromDB: false,
                                                                            proportion: 1,
                                                                            itemFiltered: List.of(),
                                                                            limitPage: 0,
                                                                            additionData: {}
                                                                          });
export const outletEntityFactory = () => entityFactory({
                                                         entityCode: OutletDB.getCode(),
                                                         currentPage: 0,
                                                         pageSize: 100,
                                                         items: List.of(),
                                                         apiUrlCode: OutletDB.getCode(),
                                                         isFinished: false,
                                                         isDependStore: false,
                                                         query: "",
                                                         propertyFilter: {}
                                                       });

export const storeEntityFactory        = () => entityFactory({
                                                               entityCode: StoreDB.getCode(),
                                                               currentPage: 0,
                                                               pageSize: 100,
                                                               items: List.of(),
                                                               apiUrlCode: StoreDB.getCode(),
                                                               isFinished: false,
                                                               isDependStore: false,
                                                               query: "",
                                                               propertyFilter: {}
                                                             });
export const retailConfigEntityFactory = () => entityFactory({
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
                                                             });
