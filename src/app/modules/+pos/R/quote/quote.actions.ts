import {Injectable} from '@angular/core';
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Store} from "@ngrx/store";
import {CustomerDB} from "../../database/xretail/db/customer";
import {Product} from "../../core/framework/catalog/Model/Product";
import {ProductDB} from "../../database/xretail/db/product";

@Injectable()
export class PosQuoteActions {
  
  static ACTION_SELECT_PRODUCT_TO_ADD         = 'ACTION_SELECT_PRODUCT_TO_ADD'; // when user select product to add
  static ACTION_ADD_PRODUCT_TO_QUOTE          = 'ACTION_ADD_PRODUCT_TO_QUOTE';
  static ACTION_WAIT_GET_PRODUCT_OPTIONS      = 'ACTION_WAIT_GET_PRODUCT_OPTIONS'; // when product has options, we will wait options has been selected
  static ACTION_UPDATE_QUOTE_ITEMS            = 'ACTION_UPDATE_QUOTE_ITEMS'; // product has been added so we need update quote state items
  static ACTION_SET_CUSTOMER_TO_QUOTE         = 'ACTION_SET_CUSTOMER_TO_QUOTE';
  static ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS = 'ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS'; // after customer added, we will resolve and save address
  
  static ACTION_RESOLVE_QUOTE = 'ACTION_RESOLVE_QUOTE'; // after resolve quote, we will save total and update some data
  
  static ACTION_UPDATE_QUOTE_INFO = 'ACTION_UPDATE_QUOTE_INFO'; // quote state information
  
  constructor(private store: Store<any>) {}
  
  setCustomerToQuote(customerEntity: Customer | CustomerDB): void {
    let customer = new Customer();
    if (customerEntity instanceof CustomerDB) {
      Object.assign(customer, customerEntity);
      customer.mapWithParent();
    } else {
      customer = customerEntity;
    }
    this.store.dispatch({type: PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE, payload: {customer}});
  }
  
  selectProductToAdd(productEntity: Product | ProductDB, qty: number = 1, forceProductCustomOptions: boolean = false, config: Object = null) {
    let product = new Product();
    product.mapWithParent(productEntity);
    
    this.store.dispatch({type: PosQuoteActions.ACTION_SELECT_PRODUCT_TO_ADD, payload: {product, qty, forceProductCustomOptions, config}});
  }
  
  updateQuoteInfoState(key: string, state: any) {
    let newState  = {};
    newState[key] = state;
    this.store.dispatch({type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO, payload: newState})
  }
}
