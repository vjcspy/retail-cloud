import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class ProductOptionsActions {
  static ACTION_CHANGE_TAB_VIEW              = 'ACTION_CHANGE_TAB_VIEW';
  static ACTION_RETRIEVE_PRODUCT_INFORMATION = 'ACTION_RETRIEVE_PRODUCT_INFORMATION';
  
  static ACTION_UPDATE_PRODUCT_CUSTOMIZABLE_OPTION = 'ACTION_UPDATE_PRODUCT_CUSTOMIZABLE_OPTION';
  
  static ACTION_CANCEL_PRODUCT_OPTIONS = 'ACTION_CANCEL_PRODUCT_OPTIONS';
  
  constructor(private store$: Store<any>) { }
  
  changeTabView(tabView: string) {
    this.store$.dispatch({type: ProductOptionsActions.ACTION_CHANGE_TAB_VIEW, payload: {tabView}})
  }
  
  cancelProductOptions() {
    this.store$.dispatch({type: ProductOptionsActions.ACTION_CANCEL_PRODUCT_OPTIONS})
  }
  
  updateProductCustomizableOption(options: Object) {
    this.store$.dispatch({type: ProductOptionsActions.ACTION_UPDATE_PRODUCT_CUSTOMIZABLE_OPTION, payload: {options}});
  }
}
