import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";

@Injectable()
export class UserEffects {
  
  constructor(protected store$: Store<any>, protected actions$: Actions) { }
}
