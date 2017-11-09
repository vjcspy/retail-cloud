import {Injectable} from '@angular/core';

@Injectable()
export class OnlineOfflineModeService {
  private _testOnline = true;
  
  constructor() {
    window['testOnline'] = (isOnline: boolean) => {
      this._testOnline = isOnline;
    }
  }
  
  get isOnline() {
    return window.navigator.onLine;
  }
  
}
