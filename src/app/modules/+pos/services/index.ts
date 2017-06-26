import {NumberHelper} from "./helper/number-helper";
import {StringHelper} from "./helper/string-helper";
import {GUARDS} from "./router-guards/index";

export const POS_SERVICES = [
  NumberHelper,
  StringHelper,
  
  ...GUARDS
];
