import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class ShopManageService {
  
  constructor() { }
  
  saveRole(role): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('license.update_role', role)
                      .subscribe(
                        () => resolve(),
                        (err) => reject(err)
                      );
    });
  }
  
  deleteRole(role): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('license.delete_role', role)
                      .subscribe(
                        () => resolve(),
                        (err) => reject(err)
                      );
    });
  }
  
  getPermissions(): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('license.get_permissions')
                      .subscribe((permissions) => resolve(permissions),
                                 (err) => reject(err));
    });
  }
  
  savePermissions(permissions, code): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('license.save_permissions', {permissions, code})
                      .subscribe(() => resolve(),
                                 (e) => reject(e));
    });
  }
  
  saveCashier(cashier): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('cashier.save', cashier)
                      .subscribe(() => resolve(),
                                 (e) => reject(e));
    });
  }
  
  saveProductLicense(licenseHasProduct): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('license.shop_save_product_license', licenseHasProduct)
                      .subscribe(() => resolve(),
                                 (e) => reject(e));
      ;
    });
  }
}
