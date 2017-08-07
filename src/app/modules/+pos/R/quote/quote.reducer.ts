import {Action, ActionReducer} from "@ngrx/store";
import {posQuoteStateFactory, PosQuoteStateRecord} from "./quote.state";
import {PosQuoteActions} from "./quote.actions";
import * as _ from 'lodash';
import {DataObject} from "../../core/framework/General/DataObject";
import {List} from "immutable";
import {PosSyncActions} from "../sync/sync.actions";
import {IntegrateRpActions} from "../integrate/rp/integrate-rp.actions";
import {PosStepActions} from "../../view/R/sales/checkout/step/step.actions";
import {mergeSliceReducers} from "../../../../R/index";
import {quoteItemReducer} from "./item/item.reducer";
import {quoteRefundReducer} from "./refund/refund.reducer";
import {Shipping} from "../../core/framework/quote/Model/Quote/Address/Total/Shipping";
import {PosGeneralActions} from "../general/general.actions";

const quoteMainReducer: ActionReducer<PosQuoteStateRecord> = (state: PosQuoteStateRecord, action: Action) => {
  switch (action.type) {
    case PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE:
      return state.set('customer', action.payload['customer']);
    
    case PosQuoteActions.ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER:
      if (action.payload['needResolveBilling'] === true) {
        state = state.set('billingAdd', action.payload['billingAdd']);
      }
      if (action.payload['needResolveShipping'] === true) {
        state = state.set('shippingAdd', action.payload['shippingAdd']);
      }
      return state;
    
    case PosQuoteActions.ACTION_NEED_RESOLVE_QUOTE:
      return state.set('items', state.items.filter((item: DataObject) => parseInt(item.getData('qty')) > 0));
    
    case PosQuoteActions.ACTION_UPDATE_QUOTE_ITEMS:
      let items: List<DataObject> = action.payload['items'];
      items                       = <any>items.filter((item: DataObject) => item.getData('qty') > 0);
      if (action.payload['replace'] === true) {
        return state.set('items', items);
      } else {
        return state.update('items', (l: List<any>) => l.concat(items));
      }
    
    case PosQuoteActions.ACTION_RESOLVE_QUOTE:
    case PosSyncActions.ACTION_SYNC_ORDER_SUCCESS:
      let refundAmount = 0;
      let gt           = 0;
      if (state.info.isRefunding && state.creditmemo) {
        refundAmount = state.creditmemo['totals']['grand_total'];
      }
      if (state.quote.getShippingAddress()['grand_total']) {
        gt = state.quote.getShippingAddress()['grand_total'];
      }
      
      return state.set('grandTotal', gt - refundAmount);
    
    case PosQuoteActions.ACTION_UPDATE_QUOTE_INFO:
      return state.update('info', (info: Object) => Object.assign({}, {...info}, {...action.payload['info']}));
    
    case PosGeneralActions.ACTION_CLEAR_GENERAL_DATA:
    case PosStepActions.ACTION_STEP_NEW_ORDER:
    case PosQuoteActions.ACTION_REORDER:
    case PosQuoteActions.ACTION_CLEAR_QUOTE:
      Shipping.SHIPPING_AMOUNT = 0;
      const isShiftOpening     = state.info.isShiftOpening;
      state.quote.removeCustomer().removeAllItems().removeAllAddresses()
           .unsetData('discount_whole_order')
           .unsetData('is_exchange')
           .unsetData('retail_note')
           .unsetData('coupon_code')
           .unsetData('payment_data')
           .unsetData('reward_point')
           .resetRetailAdditionData();
      
      return state.clear().set('creditmemo', null).set('info', {isShiftOpening}).set('quote', state.quote);
    
    case PosQuoteActions.ACTION_ADD_SHIPPING_AMOUNT:
      Shipping.SHIPPING_AMOUNT = parseFloat(action.payload['shippingAmount']);
      state                    = state.set('shippingAmount', parseFloat(action.payload['shippingAmount']))
                                      .set('hasShipment', true);
      state.quote.setData('retail_has_shipment', true);
      if (!!action.payload['shippingAdd']) {
        state = state.set('shippingAdd', Object.assign({}, {...action.payload['shippingAdd']}));
      }
      
      return state;
    
    case PosQuoteActions.ACTION_REMOVE_SHIPPING:
      Shipping.SHIPPING_AMOUNT = 0;
      state.quote.setData('retail_has_shipment', false);
      return state.set('shippingAmount', 0)
                  .set('hasShipment', false);
    
    case IntegrateRpActions.ACTION_USE_REWARD_POINT:
      return state.update('quote', (q) => q.setData('reward_point', Object.assign({}, {...q.getData('reward_point')}, {...action.payload['rpData']}, {use_reward_point: true})));
    
    case IntegrateRpActions.ACTION_REMOVE_REWARD_POINT:
      return state.update('quote', (q) => q.setData('reward_point', Object.assign({}, {use_reward_point: false})));
    
    default:
      return state;
  }
};

export const quoteReducer: ActionReducer<PosQuoteStateRecord> = mergeSliceReducers(posQuoteStateFactory(), quoteMainReducer, quoteItemReducer, quoteRefundReducer);
