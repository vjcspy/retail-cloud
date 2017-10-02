import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import {AuthenticateService} from "../../../../services/authenticate";
import {Router} from "@angular/router";

@Component({
             // moduleId: module.id,
             selector: 'sidebar-component',
             templateUrl: 'sidebar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class SidebarComponent implements OnInit {
  @Input() accountState: AccountState;
  
  constructor(public authenticate: AuthenticateService, public router: Router) { }
  
  ngOnInit() { }
}
