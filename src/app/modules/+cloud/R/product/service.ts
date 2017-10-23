import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class ProductService {
  
  constructor() { }
  
  saveProduct(product): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('product.save_product', {product})
                      .subscribe((res) => {
                                   resolve(res);
                                 },
                                 (e) => {
                                   reject(e);
                                 });
    });
  }
  
  removeProduct(id): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('product.remove_product', {id})
                      .subscribe((res) => resolve(res), (e) => reject(e));
    });
  }
}
