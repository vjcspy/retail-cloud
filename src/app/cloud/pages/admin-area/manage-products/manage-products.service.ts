import {Injectable} from '@angular/core';
import {MeteorObservable, MongoObservable} from "meteor-rxjs";
import {ToastsManager} from "ng2-toastr";
import {Router} from "@angular/router";
import {ProductCollection} from "../../../services/ddp/collections/products";

@Injectable()
export class ManageProductsService {
  viewState: any = {
    headerText: ""
  };
  protected isLoading: boolean = false;
  viewData: any  = {};

  constructor(protected toast: ToastsManager,
              protected router: Router,
              protected productCollection: ProductCollection) { }

  createProduct(product: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("product.create_product", product).subscribe((res) => {
          this.isLoading = false;
          this.router.navigate(['cloud/products']);
          this.toast.success("Create Product Successful");
          resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  editProduct(product: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("product.edit_product", product).subscribe((res) => {
        this.isLoading = false;
        this.router.navigate(['cloud/products/' + product._id]);
        this.toast.success("Edit Product Successfully");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }

  removeProduct(data: any){
    return new Promise<void>((resolve, reject) => {
      this.isLoading = true;
      MeteorObservable.call("product.remove_product", data).subscribe((res) => {
        this.isLoading = false;
        this.toast.success("Remove Product Successfully");
        resolve();
      }, (err) => {
        this.isLoading = false;
        this.toast.error(err.reason, err.error);
        return reject(err);
      });
    });
  }
}
