import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import {AccountActions} from "../../../../R/account/account.actions";

@Component({
             // moduleId: module.id,
             selector: 'header-component',
             templateUrl: 'header.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class HeaderComponent implements OnInit {
  @Input() accountState: AccountState;
  
  constructor(public accountActions: AccountActions) { }
  
  ngOnInit() { }
}
