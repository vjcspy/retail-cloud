import {Injectable} from '@angular/core';
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";

@Injectable()
export class AppStorage {
  
  constructor(protected storage: LocalStorageService, protected session: SessionStorageService) { }
  
  localStorage(key: string, value: any): void {
    this.storage.store(key, value);
  }
  
  localRetrieve(key: string): any {
    return this.storage.retrieve(key);
  }
  
  localClear(key?: string) {
    this.storage.clear(key);
  }
}
