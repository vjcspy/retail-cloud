import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'report-component',
             template: `
               Report document`,
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class ReportDocumentComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
