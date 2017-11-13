import {ApiManager} from "./api-manager";
import {RequestService} from "./request";
import {CustomToastOptions} from "./toast-options";
import {NotifyManager} from "./notify-manager";
import {AuthenticateService} from "./authenticate";
import {routerGuardService} from "./router-guard/index";
import {ReducerManagement} from "./reducer-management";
import {OnlineOfflineModeService} from "./online-offline-mode.service";

export const APP_PROVIDERS = [
  ApiManager,
  OnlineOfflineModeService,
  RequestService,
  CustomToastOptions,
  NotifyManager,
  AuthenticateService,
  ReducerManagement,
  ...routerGuardService
];
