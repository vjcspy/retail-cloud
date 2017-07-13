import {Component, OnInit} from '@angular/core';
import {DialogInfoData} from "./info.data";

@Component({
             // moduleId: module.id,
             selector: 'dialog-info',
             templateUrl: 'info.component.html'
           })

export class DialogInfoComponent implements OnInit {
  constructor(public infoData: DialogInfoData) { }
  
  ngOnInit() { }
}
