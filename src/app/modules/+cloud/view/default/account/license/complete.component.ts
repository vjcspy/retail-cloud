import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'complete-component',
             templateUrl: 'complete.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountLicenseCompleteComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
