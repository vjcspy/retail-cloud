import {ApiManager} from "./api-manager";
import {RequestService} from "./request";
import {CustomToastOptions} from "./toast-options";
import {NotifyManager} from "./notify-manager";
import {RetailTranslate} from "./retail-translate";
import {AuthenticateService} from "./authenticate";
import {routerGuardService} from "./router-guard/index";
import {ReducerManagement} from "./reducer-management";

export const APP_PROVIDERS = [
  ApiManager,
  RequestService,
  CustomToastOptions,
  NotifyManager,
  RetailTranslate,
  AuthenticateService,
  ReducerManagement,
  ...routerGuardService
];
