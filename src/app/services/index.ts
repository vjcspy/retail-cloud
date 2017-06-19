import {ApiManager} from "./api-manager";
import {RequestService} from "./request";
import {CustomToastOptions} from "./toast-options";
import {DatabaseManager} from "./database-manager";
import {NotifyManager} from "./notify-manager";
import {RetailTranslate} from "./retail-translate";
import {AuthenticateService} from "./authenticate";

export const APP_PROVIDERS = [
  DatabaseManager,
  ApiManager,
  RequestService,
  CustomToastOptions,
  NotifyManager,
  RetailTranslate,
  AuthenticateService
];
