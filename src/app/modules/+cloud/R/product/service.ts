import {Injectable} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";

@Injectable()
export class ProductService {
  
  constructor() { }
  
  saveProduct(product): Promise<any> {
    return new Promise((resolve, reject) => {
      MeteorObservable.call('product.save_product', {product})
                      .subscribe((res) => {
                                   console.log(res);
                                   resolve();
                                 },
                                 (e) => {
                                   console.log(e);
                                   reject(e);
                                 });
    });
  }
}
