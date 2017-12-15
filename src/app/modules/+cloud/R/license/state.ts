import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export interface LicenseState {
  isProcessing: boolean;
}

export interface LicenseStateRecord extends TypedRecord<any>, LicenseState {

}

export const licenseStateFactory = makeTypedFactory<LicenseState, LicenseStateRecord>({
                                                                                        isProcessing: false
                                                                                      });
