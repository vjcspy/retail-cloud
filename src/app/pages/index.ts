import {PageNotFound} from "./404";
import {ACCOUNT_PAGES} from "./account/index.";

export const APP_PAGES = [
  PageNotFound,
  ...ACCOUNT_PAGES
];
