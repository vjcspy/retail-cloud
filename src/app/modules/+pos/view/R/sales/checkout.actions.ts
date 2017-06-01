import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosCheckoutActions {
  static ACTION_SAVE_GRID_WIDTH_HEIGHT = 'ACTION_SAVE_GRID_WIDTH_HEIGHT';
  static ACTION_CALCULATE_GRID_STYLE   = 'ACTION_CALCULATE_GRID_STYLE';
  static ACTION_RESOLVE_GRID_PRODUCT   = 'ACTION_RESOLVE_GRID_PRODUCT';
  
  constructor(private store: Store<any>) { }
  
  saveGridWidthHeight(gridWidth: number, gridHeight: number): void {
    this.store.dispatch({type: PosCheckoutActions.ACTION_SAVE_GRID_WIDTH_HEIGHT, payload: {gridWidth, gridHeight}});
  }
  
}
