import {Component, OnInit} from '@angular/core';
import {MenuLeftActions} from "../../../R/sales/menu/left/left.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-list',
             templateUrl: 'list.component.html'
           })
export class PosDefaultSalesShiftsListComponent implements OnInit {
  constructor(public menuLeftActions: MenuLeftActions) { }
  
  ngOnInit() { }
  
}
