import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {List} from "immutable";
import * as moment from 'moment';

export interface OrderList {
  isResolving: boolean;
  isSearchOnline: boolean;
  searchString: string;
  searchOrderStatus: string;
  searchDateFrom: moment.Moment;
  searchDateTo: moment.Moment;
  
  ordersGroped: List<any>;
}

export interface OrderListRecord extends TypedRecord<any>, OrderList {}

export const orderListFactory = makeTypedFactory<OrderList, OrderListRecord>(
  {
    isResolving: false,
    isSearchOnline: false,
    searchString: '',
    searchOrderStatus: null,
    searchDateFrom: moment().subtract(7, 'days').hour(0).minute(0).second(0),
    searchDateTo: moment().hour(23).minute(59).second(59),
    
    ordersGroped: List.of(),
  }
);
