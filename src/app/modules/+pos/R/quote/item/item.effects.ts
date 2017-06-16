import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {QuoteItemActions} from "./item.actions";
import {Item} from "../../../core/framework/quote/Model/Quote/Item";
import {PosQuoteActions} from "../quote.actions";
import {PosConfigState} from "../../config/config.state";

@Injectable()
export class QuoteItemEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions) { }
  
  @Effect() updateItemBuyRequest = this.actions$
                                       .ofType(QuoteItemActions.ACTION_UPDATE_ITEM_BUY_REQUEST)
                                       .withLatestFrom(this.store$.select('config'))
                                       .map((z) => {
                                         const action: Action              = <any>z[0];
                                         const configState: PosConfigState = <any>z[1];
                                         const item: Item                  = action.payload['item'];
                                         let value                         = action.payload['value'];
    
                                         switch (action.payload['key']) {
                                           case 'qty':
                                             if (!item.getProduct()['stock_items'] || item.getProduct()['stock_items']['is_qty_decimal'] != '1') {
                                               value = Math.round(value);
                                             }
                                             item.getBuyRequest().setData('qty', value);
                                             break;
      
                                           case 'discount_per_item':
                                             if (item.getBuyRequest().getData('is_discount_value')) {
                                               if (configState.setting.tax.discountTax() && value > item.getData('price_incl_tax')) {
                                                 value = item.getData('price_incl_tax');
                                               } else if (!configState.setting.tax.discountTax() && value > item.getCalculationPrice()) {
                                                 value = item.getCalculationPrice();
                                               }
                                               item.getBuyRequest()
                                                   .setData('is_discount_value', true)
                                                   .setData('discount_per_item', value)
                                                   .setData('retail_discount_per_items_percent', 0);
                                             } else {
                                               if (value > 100) {
                                                 value = 100;
                                               }
                                               item.getBuyRequest()
                                                   .setData('is_discount_value', false)
                                                   .setData('discount_per_item', 0)
                                                   .setData('retail_discount_per_items_percent', value);
                                             }
                                             break;
      
                                           default:
                                             item.getBuyRequest().setData(action.payload['key'], value);
                                         }
    
                                         return {type: PosQuoteActions.ACTION_NEED_RESOLVE_QUOTE};
                                       });
}
