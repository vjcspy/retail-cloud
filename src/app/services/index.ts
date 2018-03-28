import {ApiManager} from "./api-manager";
import {RequestService} from "./request";
import {CustomToastOptions} from "./toast-options";
import {DatabaseManager} from "./database-manager";
import {NotifyManager} from "./notify-manager";
import {AuthenticateService} from "./authenticate";
import {routerGuardService} from "./router-guard/index";
import {ReducerManagement} from "./reducer-management";
import {TrackingService} from "./tracking/tracking-service";

export const APP_PROVIDERS = [
  DatabaseManager,
  ApiManager,
  RequestService,
  CustomToastOptions,
  NotifyManager,
  AuthenticateService,
  ReducerManagement,
  TrackingService,
  ...routerGuardService
];
