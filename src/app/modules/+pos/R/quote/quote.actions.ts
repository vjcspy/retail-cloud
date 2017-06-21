import {Injectable} from '@angular/core';
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Action, Store} from "@ngrx/store";
import {CustomerDB} from "../../database/xretail/db/customer";
import {Product} from "../../core/framework/catalog/Model/Product";
import {ProductDB} from "../../database/xretail/db/product";
import {DataObject} from "../../core/framework/General/DataObject";

@Injectable()
export class PosQuoteActions {
  
  // when user select product to add
  static ACTION_SELECT_PRODUCT_TO_ADD            = 'ACTION_SELECT_PRODUCT_TO_ADD';
  // push item buy request
  static ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE    = 'ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE';
  // when product has options, we will wait options has been selected
  static ACTION_WAIT_GET_PRODUCT_OPTIONS         = 'ACTION_WAIT_GET_PRODUCT_OPTIONS';
  // product has been added so we need update quote state items
  static ACTION_UPDATE_QUOTE_ITEMS               = 'ACTION_UPDATE_QUOTE_ITEMS';
  // set customer to quote
  static ACTION_SET_CUSTOMER_TO_QUOTE            = 'ACTION_SET_CUSTOMER_TO_QUOTE';
  // after customer added, we will resolve and save address
  static ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER = 'ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER';
  
  static ACTION_NEED_RESOLVE_QUOTE = 'ACTION_NEED_RESOLVE_QUOTE';
  static ACTION_RESOLVE_QUOTE      = 'ACTION_RESOLVE_QUOTE'; // after resolve quote, we will save total and update some data
  static ACTION_CLEAR_QUOTE        = 'ACTION_CLEAR_QUOTE';
  
  constructor(private store$: Store<any>) {}
  
  setCustomerToQuote(customerEntity: Customer | CustomerDB): void {
    let customer = new Customer();
    if (customerEntity instanceof CustomerDB) {
      Object.assign(customer, customerEntity);
      customer.mapWithParent();
    } else {
      customer = customerEntity;
    }
    this.store$.dispatch({type: PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE, payload: {customer}});
  }
  
  selectProductToAdd(productEntity: Product | ProductDB, qty: number = 1, forceProductCustomOptions: boolean = false, config: Object = null) {
    let product = new Product();
    product.mapWithParent(productEntity);
    
    this.store$.dispatch({type: PosQuoteActions.ACTION_SELECT_PRODUCT_TO_ADD, payload: {product, qty, forceProductCustomOptions, config}});
  }
  
  clearQuote() {
    this.store$.dispatch({type: PosQuoteActions.ACTION_CLEAR_QUOTE});
  }
  
  editProductOptionBuyRequest(product: Product, buyRequest: DataObject) {
    this.store$.dispatch({type: PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS, payload: {product, buyRequest, currentProcessing: 'EDIT'}})
  }
  
  /**
   ** @REDUCER:
   *
   * Update quote info (shift, refund...)
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_UPDATE_QUOTE_INFO = 'ACTION_UPDATE_QUOTE_INFO';
  
  updateQuoteInfo(info, dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO, payload: {info}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
