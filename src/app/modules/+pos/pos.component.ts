import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {posReducer, PosState} from "./R/index";
import {OfflineService} from "../share/provider/offline";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`
           })
export class PosComponent {
  constructor(private store: Store<PosState>, private offline: OfflineService) {
    this.store.replaceReducer(posReducer);
    this.offline.init();
  }
}
