import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {ProductDB} from "../../../../../database/xretail/db/product";
import {List} from "immutable";

export interface PullPerformanceState {
  isLoadedDepend: boolean;
  pageSize: number;
  entity: string;
  storeId: number;
  currentPage: number;
  isPulling: boolean;
  isComplete: boolean;
  isPullFromCache: boolean;
  performanceData?: List<any>;
}

export interface PullPerformanceStateRecord extends TypedRecord<any>, PullPerformanceState {}

export const pullPerformanceStateFactory = makeTypedFactory<PullPerformanceState, PullPerformanceStateRecord>(
  {
    isLoadedDepend: false,
    pageSize: 100,
    entity: ProductDB.getCode(),
    storeId: 1,
    currentPage: 0,
    isPulling: false,
    isComplete: false,
    isPullFromCache: false,
    performanceData: List.of()
  }
);
