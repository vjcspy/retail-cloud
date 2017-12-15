import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class LicenseService {
  
  constructor() { }
  
  saveLicenseByAdmin(license, licenseHasProduct, user): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call("license.admin_save_license", {license, licenseHasProduct, user})
                      .subscribe(() => resolve(), (err) => reject(err));
    });
  }
}
