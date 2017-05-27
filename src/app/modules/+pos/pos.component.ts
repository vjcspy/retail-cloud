import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {posReducer, PosState} from "./R/index";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`
           })
export class PosComponent {
  constructor(private store: Store<PosState>) {
    this.store.replaceReducer(posReducer);
  }
}
