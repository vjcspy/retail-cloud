import {Braintree} from "./payments/braintree";
import {BrainTreeMeteorServer} from "./payments/braintree/server";

export const SERVICES = [
  Braintree,
  
  BrainTreeMeteorServer
];
