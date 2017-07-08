import {makeTypedFactory, TypedRecord} from "typed-immutable-record";
import {TaxConfig} from "../../core/framework/tax/Model/TaxConfig";
import {CustomerSetting} from "../../core/framework/setting/CustomerSetting";
import {ProductSetting} from "../../core/framework/setting/ProductSetting";
import {ShippingSetting} from "../../core/framework/setting/ShippingSetting";

/*
 * Bao gồm 2 phần đó là phần default setting cho POS và những constrain setting
 */
export interface PosConfigState {
  posRetailConfig: {
    numberOfSearchCustomerResult: number;
    numberOfSearchProductResult: number;
    fieldSearchProduct: string[];
    fieldSearchCustomer: string[];
    useCustomerOnlineMode: boolean;
    fieldSearchOrderOffline: string[];
    supportUnicodeInSearch: boolean;
    waitTimeEachSearch: number;
    displayRealTax: boolean;
    allowSplitPayment: boolean;
    allowPartialPayment: boolean;
    isIntegrateRP: boolean;
    rpType: string;
    inclDiscountPerItemInDiscount: boolean
    sortCategoryBaseOn: string;
    sortCategorySorting: string;
  };
  constrain: {
    debounceTimeUpdateItemBuyRequest: number;
    debounceTimeResize: number;
    debounceTimeSearch: number;
    debounceTimeWaitAnimation: number;
    debounceTimeResolveQuote: number;
    minLengthSearching: number;
  };
  isResolveSetting: boolean;
  setting: {
    tax: TaxConfig;
    customer: CustomerSetting;
    product: ProductSetting;
    shipping: ShippingSetting;
  };
  orderCount: Object;
  receipt: Object;
}

export interface PosConfigStateRecord extends TypedRecord<any>, PosConfigState {}

export const posConfigStateFactory = makeTypedFactory<PosConfigState, PosConfigStateRecord>(
  {
    posRetailConfig: {
      numberOfSearchCustomerResult: 7,
      numberOfSearchProductResult: 20,
      fieldSearchProduct: ["name", "sku", "type_id"],
      fieldSearchCustomer: ["first_name", "last_name", "telephone", "email", "id"],
      useCustomerOnlineMode: true,
      fieldSearchOrderOffline: ["first_name", "last_name", "telephone", "email", "magento_order_id", "customer_id", "client_order_id"],
      supportUnicodeInSearch: false,
      waitTimeEachSearch: 177,
      displayRealTax: true,
      allowSplitPayment: true,
      allowPartialPayment: true,
      isIntegrateRP: true,
      rpType: 'aheadWorld',
      inclDiscountPerItemInDiscount: false,
      sortCategoryBaseOn: 'name',
      sortCategorySorting: 'asc'
    },
    constrain: {
      debounceTimeUpdateItemBuyRequest: 1234,
      debounceTimeResize: 100,
      debounceTimeSearch: 500,
      debounceTimeWaitAnimation: 250,
      debounceTimeResolveQuote: 250,
      minLengthSearching: 2
    },
    isResolveSetting: false,
    setting: {
      tax: null,
      customer: null,
      shipping: null,
      product: null
    },
    orderCount: {},
    receipt: {}
  });
