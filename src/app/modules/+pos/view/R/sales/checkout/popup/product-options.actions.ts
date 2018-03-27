import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class ProductOptionsActions {
  static ACTION_CHANGE_TAB_VIEW              = 'ACTION_CHANGE_TAB_VIEW';
  static ACTION_RETRIEVE_PRODUCT_INFORMATION = 'ACTION_RETRIEVE_PRODUCT_INFORMATION';

  static ACTION_UPDATE_PRODUCT_OPTION_DATA          = 'ACTION_UPDATE_PRODUCT_OPTION_DATA';
  static ACTION_RE_INIT_SUPER_ATTRIBUTE_SELECT_DATA = 'ACTION_RE_INIT_SUPER_ATTRIBUTE_SELECT_DATA';

  static ACTION_CONFIRM_PRODUCT_OPTIONS = 'ACTION_CONFIRM_PRODUCT_OPTIONS';
  static ACTION_CANCEL_PRODUCT_OPTIONS  = 'ACTION_CANCEL_PRODUCT_OPTIONS';

  constructor(private store$: Store<any>) {
  }

  changeTabView(tabView: string) {
    this.store$.dispatch({type: ProductOptionsActions.ACTION_CHANGE_TAB_VIEW, payload: {tabView}});
  }

  cancelProductOptions() {
    this.store$.dispatch({type: ProductOptionsActions.ACTION_CANCEL_PRODUCT_OPTIONS});
  }

  confirmProductOptions() {
    this.store$.dispatch({type: ProductOptionsActions.ACTION_CONFIRM_PRODUCT_OPTIONS});
  }

  updateProductOptionData(optionType: string, optionValue: any, forceCreateNew: boolean = false) {
    this.store$.dispatch({
      type: ProductOptionsActions.ACTION_UPDATE_PRODUCT_OPTION_DATA,
      payload: {optionType, optionValue, forceCreateNew}
    });
  }

  static ACTION_GET_WAREHOUSE_ITEM = "ACTION_GET_WAREHOUSE_ITEM";

  getWarehouseItem(dispatch: boolean = true): Action {
    const action = {type: ProductOptionsActions.ACTION_GET_WAREHOUSE_ITEM, payload: {}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }

  static ACTION_GET_WAREHOUSE_ITEM_AFTER = "ACTION_GET_WAREHOUSE_ITEM_AFTER";

  getWarehouseItemAfter(data, dispatch: boolean = true): Action {
    const action = {type: ProductOptionsActions.ACTION_GET_WAREHOUSE_ITEM_AFTER, payload: {data}};

    if (dispatch === true) {
      this.store$.dispatch(action);
    }

    return action;
  }
}
