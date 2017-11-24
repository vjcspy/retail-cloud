import {Injectable} from '@angular/core';
import {Actions, Effect} from "@ngrx/effects";
import {MenuService} from "./service";
import {MenuActions} from "./actions";
import {UserCollection} from "../../../../services/meteor-collections/users";
import {AccountActions} from "../../../../R/account/account.actions";

@Injectable()
export class MenuEffects {
  
  constructor(protected actions$: Actions,
              protected menuService: MenuService,
              protected menuActions: MenuActions,
              protected userCollection: UserCollection) { }
  
  @Effect() initCloudModule = this.actions$
                                  .ofType(
                                    MenuActions.ACTION_INIT_CLOUD_MENU,
                                    AccountActions.ACTION_SAVE_ACCOUNT
                                  )
                                  .switchMap((z: any) => {
                                    return this.userCollection
                                               .getCollectionObservable()
                                               .map(() => {
                                                 const elem = this.menuService.initMenu();
      
                                                 return this.menuActions.saveCloudMenu(elem, false);
                                               });
                                  });
}