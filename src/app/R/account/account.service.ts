import {Injectable} from '@angular/core';
import {AppStorage} from "../../services/storage";

@Injectable()
export class AccountService {
  
  constructor(protected storage: AppStorage) { }
  
  saveUserToStorage(user: any): void {
    this.storage.localStorage('user', user);
  }
  
  removeUserFromStorage() {
    this.storage.localClear('user');
  }
}
