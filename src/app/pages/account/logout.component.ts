import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AccountActions} from "../../R/account/account.actions";

@Component({
             // moduleId: module.id,
             selector: 'logout-component',
             templateUrl: 'logout.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class LogoutComponent implements OnInit {
  constructor(protected accountActions: AccountActions) { }
  
  ngOnInit() { }
  
  logout(){
    this.accountActions.logout();
  }
}
