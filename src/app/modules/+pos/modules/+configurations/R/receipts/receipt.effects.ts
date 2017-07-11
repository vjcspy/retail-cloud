import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";

@Injectable()
export class ConfigurationsReceiptEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions) { }
  
}
