import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from "@angular/router";
import {PosGeneralService} from "../../../../R/general/general.service";
import {PosGeneralActions} from "../../../../R/general/general.actions";
import {posReducer} from "../../../../R/index";
import {Store} from "@ngrx/store";
@Injectable()
export class BaseUrlGuard implements CanActivate, CanActivateChild {
  
  constructor(protected generalService: PosGeneralService, protected generalActions: PosGeneralActions, protected store$: Store<any>) {
    this.store$.replaceReducer(posReducer);
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkGeneralDataExisted(url);
  }
  
  checkGeneralDataExisted(url: string) {
    const baseUrl = this.generalService.getBaseUrl();
    if (baseUrl) {
      this.generalActions.selectWebsite(baseUrl);
      return true;
    }
    
    this.generalActions.goOutletRegisterPage(url);
    return false;
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
