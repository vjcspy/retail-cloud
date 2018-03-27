import {NumberHelper} from "./helper/number-helper";
import {StringHelper} from "./helper/string-helper";
import {GUARDS} from "./router-guards/index";
import {PAYMENT_INTEGRATIONS} from "./payment-integrate/index";
import {RetailDataHelper} from "./retail-data-helper";

export const POS_SERVICES = [
  NumberHelper,
  StringHelper,
  RetailDataHelper,

  ...GUARDS,
  ...PAYMENT_INTEGRATIONS,
];
