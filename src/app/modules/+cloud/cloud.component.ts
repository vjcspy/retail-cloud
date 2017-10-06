import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ReducerManagement} from "../../services/reducer-management";
import {cloudReducer} from "./R/index";

@Component({
             // moduleId: module.id,
             selector: 'cloud-component',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class CloudComponent implements OnInit {
  constructor(protected reducerManagement: ReducerManagement) {
    this.reducerManagement.replaceReducer('cloud', cloudReducer());
  }
  
  ngOnInit() {
    console.log("loaded cloud");
  }
}
