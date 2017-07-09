import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from "@angular/router";
import {PosGeneralService} from "../../../../R/general/general.service";
import {PosGeneralActions} from "../../../../R/general/general.actions";
import {posReducer} from "../../../../R/index";
import {ReducerManagement} from "../../../../../../services/reducer-management";

@Injectable()
export class BaseUrlGuard implements CanActivate, CanActivateChild {
  
  constructor(protected generalService: PosGeneralService, protected generalActions: PosGeneralActions, protected reducerManagement: ReducerManagement) {
    this.reducerManagement.replaceReducer('posReducer', posReducer());
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
