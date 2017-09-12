import {Action, ActionReducer} from "@ngrx/store";
import {checkoutProductStateFactory, CheckoutProductStateRecord} from "./product.state";
import {CheckoutProductActions} from "./product.actions";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import * as _ from 'lodash';
import {mergeSliceReducers} from "../../../../../../../R/index";
import {checkoutProductCategoryReducer} from "./category/category.reducer";
import {PosGeneralActions} from "../../../../../R/general/general.actions";
import {routerActions} from "@ngrx/router-store";
import {PosStepActions} from "../step/step.actions";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";

const checkoutProductMainReducer: ActionReducer<CheckoutProductStateRecord> = (state: CheckoutProductStateRecord, action: Action) => {
  switch (action.type) {
    
    case CheckoutProductActions.ACTION_RESOLVE_CATALOG_PRODUCT:
      return state.set('catalogProducts', action.payload['catalogProducts']);
    
    case CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT:
      let baseWidthProductGrid: number;
      if (action.payload['gridWidth'] < 800) {
        baseWidthProductGrid = 120;
      } else if (action.payload['gridWidth'] < 1200) {
        baseWidthProductGrid = 190;
      } else {
        baseWidthProductGrid = 220;
      }
      return state.set('productGridWidth', action.payload['gridWidth'])
                  .set('productGridHeight', action.payload['gridHeight'])
                  .set('productGridStyleValue', Object.assign({}, state.productGridStyleValue, {baseWidthProductGrid}));
    
    case CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE:
      const gridWidth  = state.productGridWidth;
      const gridHeight = state.productGridHeight;
      
      // Calculate width
      let currentWidth = gridWidth - state.productGridStyleValue['paddingGrid'];
      let viewExtend   = state.productGridStyleValue['baseWidthProductGrid'] + state.productGridStyleValue['marginProductLeftRight'];
      
      // trueColumn never is an integer to calculate resize
      let trueColumn = currentWidth / viewExtend - 0.001;
      let numOfCol   = parseInt(trueColumn + "");
      
      // 1px for rounding
      let resizePercent     = (currentWidth - viewExtend * numOfCol - 1) * 100 / (numOfCol * viewExtend);
      let itemWidth: number = (viewExtend * (100 + resizePercent) / 100) - state.productGridStyleValue['marginProductLeftRight'];
      itemWidth             = NumberHelper.round(itemWidth, 4);
      
      // Calculate height and item per page
      let currentHeight   = gridHeight;
      let itemHeight: any = parseFloat(itemWidth + "");
      let trueRow         = currentHeight / (itemHeight + state.productGridStyleValue['marginProductTop']);
      let numOfRow        = parseInt(trueRow + "");
      
      let beautyRow = NumberHelper.round(trueRow, 0);
      if (beautyRow > trueRow) {
        if ((currentHeight / beautyRow) >= (itemHeight * state.productGridStyleValue['stretchAspectRatioAllows'])) {
          numOfRow   = beautyRow;
          itemHeight =
            parseFloat(((currentHeight) / beautyRow).toFixed(2)) - state.productGridStyleValue['marginProductTop'];
        } else {
          let beautyHeight =
                parseFloat((currentHeight / numOfRow).toFixed(2)) - state.productGridStyleValue['marginProductTop'];
          itemHeight       = itemHeight * state.productGridStyleValue['stretchLengthRatioAllows'];
          itemHeight       = Math.min(beautyHeight, itemHeight);
        }
      } else {
        if ((currentHeight / trueRow) <= itemHeight * state.productGridStyleValue['stretchLengthRatioAllows']) {
          itemHeight = parseFloat((currentHeight / trueRow).toFixed(2)) - state.productGridStyleValue['marginProductTop'];
        }
      }
      
      return state.set('productGridStyles', {width: itemWidth + "px", height: itemHeight + "px"})
                  .set('productGridNumOfProductPerPage', numOfCol * numOfRow);
    
    case CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT:
      /*
       * Vẫn giữ lại phần paging tuy nhiên sẽ dùng hơi khác đi.
       * Thứ nhất vẫn có total page để check xem người dùng có thể scroll xuống tiếp hay không
       * Thứ hai vẫn giữ lại current page nhưng số lượng sản phẩm lấy ra sẽ bằng current page * number product per page
       * */
      // const totalPage   = action.payload['totalsPage'];
      // const currentPage = action.payload['currentPage'];
      
      // let pagesView: any[] = [];
      // if (_.isNumber(totalPage) && totalPage > 0) {
      //   if (totalPage <= 6) {
      //     for (let i = 1; i <= totalPage; i++) {
      //       pagesView.push(i);
      //     }
      //   } else {
      //     pagesView.push(1);
      //     // Before
      //     if ((currentPage - 1) > 3) {
      //       pagesView.push("...");
      //       for (let i = (currentPage - 2); i < currentPage; i++) {
      //         pagesView.push(i);
      //       }
      //     } else if (currentPage > 1) {
      //       for (let i = 2; i < currentPage; i++) {
      //         pagesView.push(i);
      //       }
      //     }
      //     // current
      //     if (currentPage !== 1) {
      //       pagesView.push(currentPage);
      //     }
      //     // After
      //     if ((totalPage - currentPage) > 3) {
      //       for (let i = (currentPage + 1); i < (currentPage + 3); i++) {
      //         pagesView.push(i);
      //       }
      //       pagesView.push("...");
      //     } else if (currentPage < totalPage) {
      //       for (let i = (currentPage + 1); i < totalPage; i++) {
      //         pagesView.push(i);
      //       }
      //     }
      //     // End
      //     if (currentPage !== totalPage) {
      //       pagesView.push(totalPage);
      //     }
      //   }
      // }
      
      return state.set('productGridProducts', action.payload['productGridProducts'])
                  // .set('productGridPagingData', pagesView)
                  .set('productGridCurrentPage', action.payload['currentPage'])
                  .set('productGridTotals', action.payload['totalsProduct'])
                  .set('productGridTotalsPage', action.payload['totalsPage']);
    
    case CheckoutProductActions.ACTION_UPDATE_GRID_STATE:
      let newState = state;
      _.forEach(action.payload, (v: any, k: string) => {
        if (k === 'productGridCurrentPage') {
          if (v <= state.productGridTotalsPage && v > 0) {
            newState = newState.set(k, v);
          }
        } else {
          if (k === 'searchString') {
            newState.set('lastLuckySearchString', null);
          }
          newState = newState.set(k, v);
        }
      });
      return newState;
    
    case CheckoutProductActions.ACTION_LOAD_MORE_PAGE:
      if ((state.productGridCurrentPage + state.bufferPageView) < state.productGridTotalsPage) {
        return state.update('productGridCurrentPage', (productGridCurrentPage) => productGridCurrentPage + 1);
      } else {
        return state;
      }
    
    case CheckoutProductActions.ACTION_CHANGE_VIEW_MODE:
      return state.set('isGridMode', action.payload['isGridMode'])
                  .set('productGridCurrentPage', 1);
    
    case PosGeneralActions.ACTION_CLEAR_GENERAL_DATA:
      return checkoutProductStateFactory();
    
    case CheckoutProductActions.ACTION_UPDATE_LUCKY_SEARCH:
      return state.set('lastLuckySearchString', action.payload['searchString']);
    
    case routerActions.UPDATE_LOCATION:
    case PosStepActions.ACTION_STEP_NEW_ORDER:
    case PosQuoteActions.ACTION_REORDER:
    case PosQuoteActions.ACTION_CLEAR_QUOTE:
      return state.set('lastLuckySearchString', null)
                  .set('searchString', null);
    
    default:
      return state;
  }
};

export const checkoutProductReducer = mergeSliceReducers(checkoutProductStateFactory(), checkoutProductMainReducer, checkoutProductCategoryReducer);
