import {Injectable, Injector} from '@angular/core';

@Injectable()
export class AppService {
  static $Injector;
  
  constructor(protected injector: Injector) {
    AppService.$Injector = injector;
  }
}
