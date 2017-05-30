import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";

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
}
export interface EntityRecord extends TypedRecord<EntityRecord>, Entity {}

export const entityFactory = makeTypedFactory<Entity, EntityRecord>({
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
                                                                      needRealTime: false
                                                                    });
