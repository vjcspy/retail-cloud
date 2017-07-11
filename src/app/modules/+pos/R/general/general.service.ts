import {Injectable} from '@angular/core';
import {AppStorage} from "../../../../services/storage";
import {AuthenticateService} from "../../../../services/authenticate";
import {GeneralException} from "../../core/framework/General/Exception/GeneralException";

@Injectable()
export class PosGeneralService {
  constructor(protected storage: AppStorage,
              protected authService: AuthenticateService) {}
  
  resolveGeneralDataFromStorage() {
    const outlet   = this.storage.localRetrieve('outlet');
    const register = this.storage.localRetrieve('register');
    const store    = this.storage.localRetrieve('store');
    const baseUrl  = this.storage.localRetrieve('baseUrl');
    
    let user = this.authService.user;
    
    if (!user) {
      throw new GeneralException("Can't find user");
    }
    user = Object.assign({}, {...user}, {id: user['_id']});
    
    if (!!outlet && !!register && !!store && !!baseUrl) {
      return {outlet, register, store, baseUrl, user};
    } else {
      return null;
    }
  }
  
  getBaseUrl() {
    return this.storage.localRetrieve('baseUrl');
  }
  
  saveGeneralDataToDB(generalData) {
    this.storage.localStorage('outlet', generalData['outlet']);
    this.storage.localStorage('store', generalData['store']);
    this.storage.localStorage('register', generalData['register']);
  }
  
  removeGeneralDataInStorage() {
    this.storage.localClear('outlet');
    this.storage.localClear('register');
    this.storage.localClear('store');
    this.storage.localClear('baseUrl');
  }
}
