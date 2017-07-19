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


const quoteMainReducer: ActionReducer<PosQuoteStateRecord> = (state: PosQuoteStateRecord, action: Action) => {
  switch (action.type) {
    case PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE:
      return state.set('customer', action.payload['customer']);
    
    case PosQuoteActions.ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER:
      let newState = state;
      _.forEach(action.payload, (v, k) => {
        if (!!v) {
          newState = newState.set(k, v);
        }
      });
      return newState;
    
    case PosQuoteActions.ACTION_UPDATE_QUOTE_ITEMS:
      let items: List<DataObject> = action.payload['items'];
      items                       = <any>items.filter((item: DataObject) => item.getData('qty') > 0);
      
      return state.set('items', items);
    
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
    
    case PosStepActions.ACTION_STEP_NEW_ORDER:
    case PosQuoteActions.ACTION_CLEAR_QUOTE:
      const isShiftOpening = state.info.isShiftOpening;
      state.quote.removeCustomer().removeAllItems().removeAllAddresses()
           .unsetData('discount_whole_order')
           .unsetData('is_exchange')
           .unsetData('retail_note')
           .unsetData('coupon_code')
           .unsetData('payment_data')
           .unsetData('reward_point')
           .resetRetailAdditionData();
      
      return state.clear().set('info', {isShiftOpening}).set('quote', state.quote);
    
    case IntegrateRpActions.ACTION_USE_REWARD_POINT:
      return state.update('quote', (q) => q.setData('reward_point', Object.assign({}, {...q.getData('reward_point')}, {...action.payload['rpData']}, {use_reward_point: true})));
    
    case IntegrateRpActions.ACTION_REMOVE_REWARD_POINT:
      return state.update('quote', (q) => q.setData('reward_point', Object.assign({}, {use_reward_point: false})));
    
    default:
      return state;
  }
};

export const quoteReducer: ActionReducer<PosQuoteStateRecord> = mergeSliceReducers(posQuoteStateFactory(), quoteMainReducer, quoteItemReducer, quoteRefundReducer);
