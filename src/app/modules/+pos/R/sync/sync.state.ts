import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface PosOrderSync {
  outlet_id: number;
  register_id: number;
  retail_user :string;
  retail_note: string;
  reference_number: string;
  user_id: string;
  retail_has_shipment: boolean;
  created_in_offline: boolean;
  items: any[];
  account: {
    group_id: number; email: string;
  };
  customer_id: number;
  store_id: number;
  order: {
    billing_address: Object;
    shipping_address: Object;
    payment_method: string;
    shipping_method: string;
    shipping_amount: number;
    coupon: {
      code: string;
    };
    whole_order_discount: {
      value: number;
      isPercentMode: boolean;
    };
    payment_data: Object;
    is_exchange: boolean;
  };
  retail_addition_data: Object;
  reward_point: Object;
}

export interface PosOrderSyncRecord extends TypedRecord<any>, PosOrderSync {}

export const posOrderSyncFactory = makeTypedFactory<PosOrderSync, PosOrderSyncRecord>(
  {
    outlet_id: null,
    register_id: null,
    retail_user :null,
    retail_note: null,
    reference_number: null,
    user_id: null,
    retail_has_shipment: false,
    created_in_offline: false,
    items: [],
    account: {
      group_id: null,
      email: null
    },
    customer_id: null,
    store_id: null,
    order: {
      billing_address: {},
      shipping_address: {},
      payment_method: null,
      shipping_method: null,
      shipping_amount: 0,
      coupon: {
        code: null,
      },
      whole_order_discount: {
        value: null,
        isPercentMode: null
      },
      payment_data: {},
      is_exchange: null,
    },
    retail_addition_data: {},
    reward_point: {}
  });

export interface PosSyncState {
  isSyncing: boolean;
  order: PosOrderSyncRecord;
}

export interface PosSyncStateRecord extends TypedRecord<any>, PosSyncState {}

export const posSyncStateFactory = makeTypedFactory<PosSyncState, PosSyncStateRecord>(
  {
    isSyncing: false,
    order: posOrderSyncFactory()
  }
);
