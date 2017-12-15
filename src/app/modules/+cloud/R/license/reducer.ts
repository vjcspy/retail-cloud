import {ActionReducer} from "@ngrx/store";
import {licenseStateFactory, LicenseStateRecord} from "./state";

export const licenseReducer: ActionReducer<LicenseStateRecord> = (state = licenseStateFactory(), action) => {
  
  return state;
};
