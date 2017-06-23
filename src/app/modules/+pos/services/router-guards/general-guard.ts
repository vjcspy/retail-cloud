import {Injectable}     from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot}    from '@angular/router';
import {PosGeneralService} from "../../R/general/general.service";
import {PosGeneralActions} from "../../R/general/general.actions";
import {AuthenticateService} from "../../../../services/authenticate";
import {GeneralException} from "../../core/framework/General/Exception/GeneralException";

@Injectable()
export class GeneralGuard implements CanActivate, CanActivateChild {
  constructor(protected generalService: PosGeneralService, protected generalActions: PosGeneralActions, protected authService: AuthenticateService) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkGeneralDataExisted(url);
  }
  
  checkGeneralDataExisted(url: string) {
    const generalData = this.generalService.resolveGeneralDataFromStorage();
    if (generalData) {
      const user = this.authService.user;
      if (!user) {
        throw new GeneralException("Can't find user");
      }
      generalData['user'] = {
        id: user['_id'],
        name: ''
      };
      
      this.generalActions.saveGeneralData(generalData);
      
      return true;
    }
    
    this.generalActions.goOutletRegisterPage(url);
    return false;
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
