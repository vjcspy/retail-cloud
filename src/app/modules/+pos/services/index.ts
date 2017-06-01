import {FakeService} from "./fake";
import {ProductHelper} from "./helper/product";
import {NumberHelper} from "./helper/number-helper";
import {StringHelper} from "./helper/string-helper";

export const POS_SERVICES = [
  FakeService,
  NumberHelper,
  StringHelper,
  ProductHelper
];
