import {RequestManager} from "./request-manager";
import {APIManager} from "./api-manager";
import {DashboardAPI} from "./data/dashboard";
export const API_PROVIDER = [
  RequestManager,
  APIManager,
  
  //API
  DashboardAPI
];
