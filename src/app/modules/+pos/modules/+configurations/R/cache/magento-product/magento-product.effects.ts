import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {routerActions} from "@ngrx/router-store";
import {Router} from "@angular/router";
import {MagentoProductService} from "./magento-product.service";
import {MagentoProductActions} from "./magento-product.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";
import {Observable} from "rxjs/Observable";
import {ProgressBarService} from "../../../../../../share/provider/progess-bar";

@Injectable()
export class MagentoProductEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private magentoProductService: MagentoProductService,
              private magentoProductActions: MagentoProductActions,
              private notify: NotifyManager,
              private progressBar: ProgressBarService) { }
  
  @Effect() whenGoMagentoCache = this.actions$
                                     .ofType(routerActions.UPDATE_LOCATION)
                                     .filter(() => this.router.isActive('pos/configurations/default/advanced/magento-product', false))
                                     .withLatestFrom(this.store$.select('general'))
                                     .switchMap((z: any) => {
                                       this.progressBar.start();
                                       return this.magentoProductService.createPullCacheInstanceRequest(z[1])
                                                  .filter((data) => data.hasOwnProperty('items'))
                                                  .map((data) => {
                                                    this.progressBar.done();
                                                    return this.magentoProductActions.pulledCacheInstance(data['items'], false);
                                                  });
                                     });
  
  @Effect() deleteInstance = this.actions$
                                 .ofType(
                                   MagentoProductActions.ACTION_DELETE_INSTANCE
                                 )
                                 .withLatestFrom(this.store$.select('general'))
                                 .switchMap((z: any) => {
                                   const action: Action = z[0];
    
                                   return this.magentoProductService.createDeleteInstanceRequest(action.payload['id'], z[1])
                                              .map((data) => {
                                                this.notify.success(data['messages']);
      
                                                return this.magentoProductActions.deleteInstanceSuccess(action.payload['id'], false);
                                              })
                                              .catch((e) => Observable.of(this.magentoProductActions.deleteInstanceFailed("delete_cache_instance_failed", e, false)));
                                 });
}
