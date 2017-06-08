import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class CheckoutProductActions {
  static ACTION_SAVE_GRID_WIDTH_HEIGHT = 'ACTION_SAVE_GRID_WIDTH_HEIGHT';
  static ACTION_CALCULATE_GRID_STYLE   = 'ACTION_CALCULATE_GRID_STYLE';
  //  Để refresh lại grid thi thay đổi trang hoặc searching
  static ACTION_UPDATE_GRID_STATE      = 'ACTION_UPDATE_GRID_STATE';
  // Sau khi resolve product trong grid
  static ACTION_RESOLVE_GRID_PRODUCT   = 'ACTION_RESOLVE_GRID_PRODUCT';
  
  constructor(private store$: Store<any>) { }
  
  saveGridWidthHeight(gridWidth: number, gridHeight: number): void {
    this.store$.dispatch({type: CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT, payload: {gridWidth, gridHeight}});
  }
  
  updateGridState(data): void {
    this.store$.dispatch({type: CheckoutProductActions.ACTION_UPDATE_GRID_STATE, payload: data});
  }
}
