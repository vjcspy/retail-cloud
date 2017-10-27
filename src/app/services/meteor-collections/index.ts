import {LicenseCollection} from "./licenses";
import {PriceCollection} from "./prices";
import {ProductCollection} from "./products";
import {RealtimeStorage} from "./reailtime-storage";
import {UserCollection} from "./users";
import {PriceTypeCollection} from "./price-type";
import {UserCreditCollection} from "./user-credit";

export const METEOR_COLLECTION = [
  LicenseCollection,
  PriceCollection,
  ProductCollection,
  RealtimeStorage,
  UserCollection,
  PriceTypeCollection,
  UserCreditCollection,
];
