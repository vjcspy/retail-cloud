import {salesReportReducer, SalesReportState} from "./sales-report/sales-report.reducer";
import {SalesReportService} from "./sales-report/sales-report.service";
import {SalesReportActions} from "./sales-report/sales-report.action";
import {AppState, createReducer} from "../../../R/index";
import {SalesReportEffects} from "./sales-report/sales-report.effects";
import {EffectsModule} from "@ngrx/effects";

export interface ReportState extends AppState {
  salesReport?: SalesReportState
}

const reportReducers = {
  salesReport: salesReportReducer
};

export const R_REPORT_IMPORTS = [
  EffectsModule.run(SalesReportEffects)
];

export const R_REPORT_PROVIDERS = [
  SalesReportActions,
  SalesReportService,
  SalesReportEffects
];

export const reportModuleReducer = createReducer(reportReducers);
