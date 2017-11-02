import {ChangeDetectorRef, Injectable, Injector} from '@angular/core';

@Injectable()
export class AppService {
  static $changeDetector: ChangeDetectorRef;
  static $Injector;
  
  constructor(protected injector: Injector) {
    AppService.$Injector = injector;
  }
}
