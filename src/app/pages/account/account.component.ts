import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             //moduleId: module.id,
             selector: 'account',
             templateUrl: 'account.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AccountComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
