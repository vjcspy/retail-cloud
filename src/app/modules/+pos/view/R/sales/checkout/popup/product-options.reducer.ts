import {Action, ActionReducer} from "@ngrx/store";
import {productOptionsStateFactory, ProductOptionsStateRecord} from "./product-options.state";
import {ProductOptionsActions} from "./product-options.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import * as _ from 'lodash';

export const productOptionsReducer: ActionReducer<ProductOptionsStateRecord> = (state = productOptionsStateFactory(), action: Action) => {
  switch (action.type) {
    case ProductOptionsActions.ACTION_CHANGE_TAB_VIEW:
      return state.set('tabView', action.payload['tabView']);

    case ProductOptionsActions.ACTION_RETRIEVE_PRODUCT_INFORMATION:
      return state.set('product', action.payload['product'])
                  .set('isOpenProductDetailPopup', true);

    case ProductOptionsActions.ACTION_UPDATE_PRODUCT_OPTION_DATA:
      if (action.payload['forceCreateNew'] === true) {
        return state.setIn(['optionData', action.payload['optionType']], action.payload['optionValue']);
      } else {
        return state.updateIn(['optionData',
          action.payload['optionType']], (options) => Object.assign({}, {...options}, {...action.payload['optionValue']})
        );
      }

    case ProductOptionsActions.ACTION_RE_INIT_SUPER_ATTRIBUTE_SELECT_DATA:
      return state.set('product', action.payload['product'])
                  .setIn(['optionData', 'super_attribute'], action.payload['super_attribute']);

    case PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS:
      state = state.clear()
                   // TODO: clear have bug here. It will take old reference of object
                   .setIn(['optionData', 'bundle_option'], {})
                   .setIn(['optionData', 'bundle_option_qty'], {})
                   .setIn(['optionData', 'options'], {})
                   .setIn(['optionData', 'super_attribute'], {})
                   .setIn(['optionData', 'super_group'], {})
                   .setIn(['optionData', 'gift_card'], {});

      const product    = action.payload['product'];
      const buyRequest = action.payload['buyRequest'];
      // convert if in case edit:
      switch (product.getTypeId()) {
        case 'configurable':
          if (buyRequest.getData('super_attribute')) {
            state = state.setIn(['optionData', 'super_attribute'], buyRequest.getData('super_attribute'));
          }
          break;
        case 'bundle':
          if (buyRequest.getData('bundle_option') && buyRequest.getData('bundle_option_qty')) {
            state = state.setIn(['optionData', 'bundle_option'], buyRequest.getData('bundle_option'))
                         .setIn(['optionData', 'bundle_option_qty'], buyRequest.getData('bundle_option_qty'));
          }
          break;
        default:
          break;
      }

      // convert multi select to array
      _.forEach(buyRequest.getData('options'), (optionValue, optionId) => {
        if (!!optionValue && !_.isObject(optionValue) && optionValue.indexOf(",") > -1) {
          buyRequest.getData('options')[optionId] = optionValue.split(",");
        }
      });

      if (buyRequest.getData('options')) {
        state = state.setIn(['optionData', 'options'], buyRequest.getData('options'));
      }

      if (buyRequest.getData('gift_card')) {
        state = state.setIn(['optionData', 'gift_card'], buyRequest.getData('gift_card'));
      }

      return state.set('product', product)
                  .set('buyRequest', buyRequest)
                  .set('currentProcessing', action.payload['currentProcessing']);

    case PosQuoteActions.ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE:
    case PosQuoteActions.ACTION_NEED_RESOLVE_QUOTE:
    case ProductOptionsActions.ACTION_CANCEL_PRODUCT_OPTIONS:
      return state.clear()
                  // TODO: clear have bug here. It will take old reference of object
                  .setIn(['optionData', 'bundle_option'], {})
                  .setIn(['optionData', 'bundle_option_qty'], {})
                  .setIn(['optionData', 'options'], {})
                  .setIn(['optionData', 'super_attribute'], {})
                  .setIn(['optionData', 'super_group'], {});

    case ProductOptionsActions.ACTION_GET_WAREHOUSE_ITEM_AFTER:
      if (action.payload['data']['isSuccess']) {
        return state.set('warehouseItem', action.payload['data']['warehouseItem'])
                    .set('tabView', "stock");
      } else {
        return state;
      }
    default:
      return state;
  }
};
