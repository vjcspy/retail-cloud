import {NumberHelper} from "./helper/number-helper";
import {StringHelper} from "./helper/string-helper";
import {GUARDS} from "./router-guards/index";
import {PAYMENT_INTEGRATIONS} from "./payment-integrate/index";
import {TutorialService} from "../modules/+tutorial/tutorial.service";
import {RetailDataHelper} from "./retail-data-helper";
import {TrackingService} from "../../../services/tracking/tracking-service";

export const POS_SERVICES = [
  NumberHelper,
  StringHelper,
  TrackingService,
  TutorialService,
  RetailDataHelper,
  
  ...GUARDS,
  ...PAYMENT_INTEGRATIONS,
];
