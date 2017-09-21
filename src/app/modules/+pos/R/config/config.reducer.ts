import {Action, ActionReducer} from "@ngrx/store";
import {posConfigStateFactory, PosConfigStateRecord} from "./config.state";
import {PosConfigActions} from "./config.actions";
import * as _ from 'lodash';

export const posConfigReducer: ActionReducer<PosConfigStateRecord> = (state: PosConfigStateRecord = posConfigStateFactory(), action: Action) => {
  switch (action.type) {
    case PosConfigActions.ACTION_INIT_POS_SETTINGS:
      return state.set('setting', action.payload)
                  .set('isResolveSetting', true);
    
    case PosConfigActions.ACTION_RETRIEVE_ORDER_COUNT:
      return state.update('orderCount', (o) => Object.assign({}, {...action.payload['orderCount']}));
    
    case PosConfigActions.ACTION_SAVE_RECEIPT_SETTING:
      return state.set('receipt', action.payload['receipt']);
    
    case PosConfigActions.ACTION_INIT_POS_REAIL_CONFIG:
      return state.set('posRetailConfig', resolveConfig(action.payload['configs']));
    
    default:
      return state;
  }
};

function resolveConfig(posSetting) {
  let configData: any = {
    numberOfSearchCustomerResult: 7,
    numberOfSearchProductResult: 20,
    fieldSearchProduct: ["name", "sku", "id", "price", "type_id"],
    fieldSearchCustomer: ["first_name", "last_name", "telephone", "email", "id"],
    fieldSearchOrderOffline: ["first_name", "last_name", "telephone", "email", "magento_order_id", "customer_id", "client_order_id"],
    supportUnicodeInSearch: false,
    waitTimeEachSearch: 177,
    displayRealTax: true,
    useCustomerOnlineMode: false,
    allowSplitPayment: true,
    allowPartialPayment: true,
    isIntegrateRP: true,
    rpType: 'aheadWorld',
    inclDiscountPerItemInDiscount: false,
    sortCategoryBaseOn: 'name',
    sortCategorySorting: 'asc',
    newCustomerDefaultCountry: 'US'
  };
  
  if (posSetting.hasOwnProperty('xretail/pos/search_product_attribute') && _.size(posSetting['xretail/pos/search_product_attribute']) > 0) {
    configData.fieldSearchProduct = posSetting['xretail/pos/search_product_attribute'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/search_order') &&
      _.size(posSetting['xretail/pos/search_order']) > 0) {
    configData.fieldSearchOrderOffline = posSetting['xretail/pos/search_order'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/search_customer_by_attribute') &&
      _.size(posSetting['xretail/pos/search_customer_by_attribute']) > 0) {
    let customerSearchField: any;
    if (typeof posSetting['xretail/pos/search_customer_by_attribute'] === "object") {
      customerSearchField = _.sortBy(posSetting['xretail/pos/search_customer_by_attribute']);
    } else {
      customerSearchField = posSetting['xretail/pos/search_customer_by_attribute'];
    }
    configData.fieldSearchCustomer = customerSearchField;
  }
  if (posSetting.hasOwnProperty('xretail/pos/customer_search_max_result') && posSetting['xretail/pos/customer_search_max_result'] > 0) {
    configData.numberOfSearchCustomerResult = posSetting['xretail/pos/customer_search_max_result'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/new_customer_default_country')) {
    configData.newCustomerDefaultCountry = posSetting['xretail/pos/new_customer_default_country'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/search_max_result') && posSetting['xretail/pos/search_max_result'] > 0) {
    configData.numberOfSearchProductResult = posSetting['xretail/pos/search_max_result'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/display_real_tax')) {
    configData.displayRealTax = posSetting['xretail/pos/display_real_tax'] === true || parseInt(posSetting['xretail/pos/display_real_tax']) === 1;
  }
  if (posSetting.hasOwnProperty('xretail/pos/allow_split_payment')) {
    configData.allowSplitPayment = posSetting['xretail/pos/allow_split_payment'] === true || parseInt(posSetting['xretail/pos/allow_split_payment']) === 1;
  }
  if (posSetting.hasOwnProperty('xretail/pos/allow_partial_payment')) {
    configData.allowPartialPayment = posSetting['xretail/pos/allow_partial_payment'] === true || parseInt(posSetting['xretail/pos/allow_partial_payment']) === 1;
  }
  if (posSetting.hasOwnProperty('xretail/pos/display_discount_incl_discount_peritem')) {
    configData.inclDiscountPerItemInDiscount = posSetting['xretail/pos/display_discount_incl_discount_peritem'] === true || parseInt(posSetting['xretail/pos/display_discount_incl_discount_peritem']) === 1;
  }
  if (posSetting.hasOwnProperty('xretail/pos/integrate_rp')) {
    configData.isIntegrateRP = (posSetting['xretail/pos/integrate_rp'] !== 'none' && !!posSetting['xretail/pos/integrate_rp']);
    configData.rpType        = posSetting['xretail/pos/integrate_rp'];
  }
  
  if (posSetting.hasOwnProperty('xretail/pos/sort_category_base_on')) {
    configData.sortCategoryBaseOn = posSetting['xretail/pos/sort_category_base_on'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/custom_sale_tax_class')) {
    configData.customSaleTaxClassId = posSetting['xretail/pos/custom_sale_tax_class'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/enable_custom_sale')) {
    configData.enableCustomSale = posSetting['xretail/pos/enable_custom_sale'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/sort_category_sorting')) {
    configData.sortCategorySorting = posSetting['xretail/pos/sort_category_sorting'];
  }
  if (posSetting.hasOwnProperty('xretail/pos/use_customer_online_mode')) {
    configData.useCustomerOnlineMode = posSetting['xretail/pos/use_customer_online_mode'] === true || parseInt(posSetting['xretail/pos/use_customer_online_mode']) === 1;
  }
  return configData;
}
