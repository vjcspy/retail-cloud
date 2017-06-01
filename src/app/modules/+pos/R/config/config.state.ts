import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

/*
 * Bao gồm 2 phần đó là phần default setting cho POS và những constrain setting
 */
export interface PosConfigState {
  posRetailConfig: Object;
  constrain: Object;
}

export interface PosConfigStateRecord extends TypedRecord<any>, PosConfigState {}

export const posConfigStateFactory = makeTypedFactory<PosConfigState, PosConfigStateRecord>(
  {
    posRetailConfig: {
      numberOfSearchCustomerResult: 7,
      fieldSearchProduct: ["name", "sku", "id", "price", "type_id"],
      fieldSearchProductLable: ["Name", "Sku", "Id", "Price", "Type"],
      fieldSearchCustomer: ["first_name", "last_name", "telephone", "email", "id"],
      fieldSearchOrderOffline: ["first_name", "last_name", "telephone", "email", "magento_order_id", "customer_id", "client_order_id"],
      supportUnicodeInSearch: false,
      waitTimeEachSearch: 177,
      displayRealTax: true,
      allowSplitPayment: true,
      allowPartialPayment: true,
      isIntegrateRP: true,
      rpType: 'aheadWorld',
      inclDiscountPerItemInDiscount: false
    },
    constrain: {
      debounceTimeUpdateItemBuyRequest: 1234,
      debounceTimeResize: 100,
      debounceTimeSearch: 500,
      debounceTimeWaitAnimation: 250,
      debounceTimeResolveQuote: 250,
    }
  });
