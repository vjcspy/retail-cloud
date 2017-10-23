import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ProductActions} from "./actions";
import {Observable} from "rxjs/Observable";
import {ProductService} from "./service";

@Injectable()
export class ProductEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected productActions: ProductActions,
              protected productService: ProductService) { }
  
  @Effect() saveProduct = this.actions$
                              .ofType(
                                ProductActions.ACTION_SAVE_PRODUCT
                              )
                              .switchMap((z: any) => {
                                const action: Action = z;
                                return Observable.fromPromise(this.productService.saveProduct(action.payload['product']))
                                                 .map(() => {
                                                   return this.productActions.saveProductSuccess(null, false);
                                                 })
                                                 .catch((e) => {
                                                   return Observable.of(this.productActions.saveProductFail(e && e['reason'] ?
                                                                                                              e['reason'] : '', e, false));
                                                 });
                              });
  
}
