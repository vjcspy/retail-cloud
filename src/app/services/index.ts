import {ApiManager} from "./api-manager";
import {RequestService} from "./request";
import {CustomToastOptions} from "./toast-options";
import {DatabaseManager} from "./database-manager";

export const APP_PROVIDERS = [
  DatabaseManager,
  ApiManager,
  RequestService,
  CustomToastOptions
];
