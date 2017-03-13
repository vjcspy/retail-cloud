import {Injectable} from '@angular/core';
import {MeteorObservable, MongoObservable} from "meteor-rxjs";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import {ProductCollection} from "../../../services/ddp/collections/products";

@Injectable()
export class ManagePricingsService {
  viewState: any = {
    headerText: ""
  };
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router,
              protected productCollection: ProductCollection) { }

  createPricing(product: any){
    return new Promise<void>((resolve, reject) => {
      MeteorObservable.call("pricing.create_pricing", product).subscribe((res) => {
          this.router.navigate(['cloud/pricings']);
          this.toast.success("Create Pricing Successful");
          resolve();
      }, (err) => {
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  editPricing(product: any){
    return new Promise<void>((resolve, reject) => {
      MeteorObservable.call("pricing.edit_pricing", product).subscribe((res) => {
        this.router.navigate(['cloud/pricings/' + product._id]);
        this.toast.success("Edit Pricing Successfully");
        resolve();
      }, (err) => {
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  removePricing(data: any){
    return new Promise<void>((resolve, reject) => {
      MeteorObservable.call("pricing.remove_pricing", data).subscribe((res) => {
        this.toast.success("Remove Pricing Successfully");
        resolve();
      }, (err) => {
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }
}
