import {Injectable} from '@angular/core';

@Injectable()
export class RetailConfigService {
  private _retailConfigSnapshot: any;
  
  constructor() { }
  
  get retailConfigSnapshot(): any {
    return this._retailConfigSnapshot;
  }
  
  set retailConfigSnapshot(value: any) {
    this._retailConfigSnapshot = value;
  }
}
