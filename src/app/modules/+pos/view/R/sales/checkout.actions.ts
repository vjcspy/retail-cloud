import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

@Injectable()
export class PosCheckoutActions {
  static ACTION_SAVE_GRID_WIDTH_HEIGHT = 'ACTION_SAVE_GRID_WIDTH_HEIGHT';
  static ACTION_CALCULATE_GRID_STYLE   = 'ACTION_CALCULATE_GRID_STYLE';
  
  constructor(private store: Store<any>) { }
  
  saveGridWidhtHeight(gridWidth: number, gridHeight: number): void {
    this.store.dispatch({type: PosCheckoutActions.ACTION_SAVE_GRID_WIDTH_HEIGHT, payload: {gridWidth, gridHeight}});
  }
  
}
