import {SalesState} from "./sales/sales.state";
import {createReducer} from "../../../../R/index";
import {salesReducer} from "./sales/sales.reducer";

export const R_POS_VIEW_IMPORTS = [];

export const R_POS_VIEW_PROVIDERS = [];

/*Ở đây là interface bởi vì trong component, service... chỉ lấy data chứ không được set*/
export interface PosViewState {
  salesView: SalesState;
}

export const posViewReducer = createReducer({
                                              salesView: salesReducer,
                                            });
