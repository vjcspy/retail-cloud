import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'connectpos-component',
             templateUrl:'connectpos.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ConnectposDocumentComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
