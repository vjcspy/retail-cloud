import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'connectpos-component',
             template: `
               Connect POS DOCUMENT
             `,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ConnectposDocumentComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
