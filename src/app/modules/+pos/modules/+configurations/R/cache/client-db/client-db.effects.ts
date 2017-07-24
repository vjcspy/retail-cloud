import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {routerActions} from "@ngrx/router-store";
import {Router} from "@angular/router";
import {ProgressBarService} from "../../../../../../share/provider/progess-bar";
import {ConfigurationsClientDbService} from "./client-db.service";
import {Observable} from "rxjs/Observable";
import {ConfigurationsClientDbActions} from "./client-db.actions";
import {PosEntitiesService} from "../../../../../R/entities/entities.service";
import {PosEntitiesActions} from "../../../../../R/entities/entities.actions";
import {NotifyManager} from "../../../../../../../services/notify-manager";

@Injectable()
export class ConfigurationsClientDbEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private router: Router,
              private notify: NotifyManager,
              private progressBar: ProgressBarService,
              private clientDbService: ConfigurationsClientDbService,
              private clientDbActions: ConfigurationsClientDbActions,
              private entityService: PosEntitiesService,
              private entityActions: PosEntitiesActions) { }
  
  @Effect() whenGoClientDB = this.actions$
                                 .ofType(
                                   routerActions.UPDATE_LOCATION,
                                   PosEntitiesActions.ACTION_DELETE_ENTITY
                                 )
                                 .filter(() => this.router.isActive('pos/configurations/default/advanced/client-db', false))
                                 .switchMap((z: any) => {
                                   this.progressBar.start();
                                   return Observable.fromPromise(this.clientDbService.getEntitiesInfo())
                                                    .map((data) => {
                                                      this.progressBar.done();
                                                      return this.clientDbActions.resolvedEntities(data['data']['entities'], false);
                                                    });
                                 });
  
  @Effect() deleteEntity = this.actions$
                               .ofType(ConfigurationsClientDbActions.ACTION_DELETE_ENTITY)
                               .switchMap((action: Action) => {
                                 return Observable.fromPromise(this.entityService.deleteEntityInfo(action.payload['entity']['id']))
                                                  .map(() => {
                                                    this.notify.success("delete_entity_database_successfully");
                                                    
                                                    return this.entityActions.deleteEntity(action.payload['entity']['id'], false);
                                                  });
                               });
}
