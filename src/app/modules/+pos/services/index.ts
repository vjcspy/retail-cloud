import {NumberHelper} from "./helper/number-helper";
import {StringHelper} from "./helper/string-helper";
import {GUARDS} from "./router-guards/index";
import {PAYMENT_INTEGRATIONS} from "./payment-integrate/index";
import {TrackingService} from "./tracking/tracking-service";
import {TutorialService} from "../modules/+tutorial/tutorial.service";

export const POS_SERVICES = [
  NumberHelper,
  StringHelper,
  TrackingService,
  TutorialService,
  
  ...GUARDS,
  ...PAYMENT_INTEGRATIONS,
];
