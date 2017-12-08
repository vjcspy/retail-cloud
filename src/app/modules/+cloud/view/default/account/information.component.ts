import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'account-information',
             templateUrl: 'information.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AccountInformationComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
}
