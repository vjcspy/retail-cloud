import {Injectable}     from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot}    from '@angular/router';
import {PosGeneralService} from "../../R/general/general.service";
import {PosGeneralActions} from "../../R/general/general.actions";
import {Store} from "@ngrx/store";
import {posReducer} from "../../R/index";

@Injectable()
export class GeneralGuard implements CanActivate, CanActivateChild {
  constructor(protected generalService: PosGeneralService, protected generalActions: PosGeneralActions, protected store$: Store<any>) {
    this.store$.replaceReducer(posReducer);
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    return this.checkGeneralDataExisted(url);
  }
  
  checkGeneralDataExisted(url: string) {
    const generalData = this.generalService.resolveGeneralDataFromStorage();
    console.log('1');
    if (generalData) {
      console.log('2');
      this.generalActions.saveGeneralData(generalData, false);
      
      return true;
    }
    
    this.generalActions.goOutletRegisterPage(url);
    return false;
  }
  
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
