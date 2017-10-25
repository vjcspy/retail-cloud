import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import {AuthenticateService} from "../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'sidebar-component',
             templateUrl: 'sidebar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class SidebarComponent implements OnInit {
  @Input() accountState: AccountState;
  
  openingSubmenuName: string = '';
  
  constructor(public authenticate: AuthenticateService, public router: Router, public routerActions: RouterActions) { }
  
  ngOnInit() { }
  
  openSubmenu(submenuName: string) {
    this.openingSubmenuName = this.openingSubmenuName !== submenuName ? submenuName : '';
  }
}
