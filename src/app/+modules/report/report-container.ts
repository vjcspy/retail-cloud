import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {reportModuleReducer, ReportState} from "./R/index";

@Component({
             selector: 'report-container',
             template: `
               <container></container>
             `
           })
export class ReportContainer implements OnInit {
  constructor(private store: Store<ReportState>) {
  
  }
  
  ngOnInit(): void {
    this.store.replaceReducer(reportModuleReducer);
  }
}
