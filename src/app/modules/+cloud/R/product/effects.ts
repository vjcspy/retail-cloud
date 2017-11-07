import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ProductActions} from "./actions";
import {Observable} from "rxjs/Observable";
import {ProductService} from "./service";
import {NotifyManager} from "../../../../services/notify-manager";
import {RouterActions} from "../../../../R/router/router.actions";

@Injectable()
export class ProductEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected productActions: ProductActions,
              protected notify: NotifyManager,
              protected routerActions: RouterActions,
              protected productService: ProductService) { }
  
  @Effect() saveProduct = this.actions$
                              .ofType(
                                ProductActions.ACTION_SAVE_PRODUCT
                              )
                              .switchMap((z: any) => {
                                const action: Action = z;
                                return Observable.fromPromise(this.productService.saveProduct(action.payload['product']))
                                                 .map(() => {
                                                   this.notify.success('save_product_successfully');
                                                   setTimeout(() => {
                                                     this.routerActions.go('cloud/default/product/list');
                                                   });
                                                   return this.productActions.saveProductSuccess(null, false);
                                                 })
                                                 .catch((e) => {
                                                   const reason = e && e['reason'] ? e['reason'] : '';
                                                   this.notify.error(reason);
                                                   return Observable.of(this.productActions.saveProductFail(reason, e, false));
                                                 });
                              });
  
  @Effect() removeProduct = this.actions$
                                .ofType(
                                  ProductActions.ACTION_REMOVE_PRODUCT
                                )
                                .switchMap((z: any) => {
                                  const action: Action = z;
                                  return Observable.fromPromise(this.productService.removeProduct(action.payload['id']))
                                                   .map(() => {
                                                     this.notify.success('remove_product_successfully');
                                                     return this.productActions.removeProductSuccess(false);
                                                   })
                                                   .catch((e) => {
                                                     const reason = e && e['reason'] ? e['reason'] : '';
                                                     this.notify.error(reason);
                                                     return Observable.of(this.productActions.removeProductFail(reason, e, false));
                                                   });
                                  ;
                                });
  
  @Effect() updateProductApi = this.actions$
    .ofType(
      ProductActions.ACTION_UPDATE_PRODUCT_API
    )
    .switchMap((z: any) => {
      const action: Action = z;
      return Observable.fromPromise(this.productService.saveProduct(action.payload['product']))
        .map(() => {
          this.notify.success('save_product_successfully');
          
          return this.productActions.saveProductSuccess(null, false);
        })
        .catch((e) => {
          const reason = e && e['reason'] ? e['reason'] : '';
          this.notify.error(reason);
          return Observable.of(this.productActions.saveProductFail(reason, e, false));
        });
    });
}
