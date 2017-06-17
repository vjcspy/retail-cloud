import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Item} from "../../../core/framework/quote/Model/Quote/Item";
import {DataObject} from "../../../core/framework/General/DataObject";

@Injectable()
export class QuoteItemActions {
  static ACTION_UPDATE_ITEM_BUY_REQUEST = 'ACTION_UPDATE_ITEM_BUY_REQUEST';
  static ACTION_REMOVE_ITEM_BUY_REQUEST = 'ACTION_REMOVE_ITEM_BUY_REQUEST';
  
  constructor(private store$: Store<any>) { }
  
  updateItemBuyRequest(key: string, value: any, item: Item) {
    this.store$.dispatch({type: QuoteItemActions.ACTION_UPDATE_ITEM_BUY_REQUEST, payload: {key, value, item}});
  }
  
  removeQuoteItem(buyRequest: DataObject) {
    this.store$.dispatch({type: QuoteItemActions.ACTION_REMOVE_ITEM_BUY_REQUEST, payload: {buyRequest}});
  }
}
