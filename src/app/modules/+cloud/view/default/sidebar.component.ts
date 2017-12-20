import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import {AuthenticateService} from "../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../R/router/router.actions";
import {NotifyManager} from "../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'sidebar-component',
             templateUrl: 'sidebar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class SidebarComponent implements OnInit {
  @Input() accountState: AccountState;
  
  constructor(public authenticate: AuthenticateService, public router: Router, public routerActions: RouterActions,   protected notify : NotifyManager) { }
  
  ngOnInit() { }
  
  openDashboard() {
    if (this.authenticate.userCan('access_creport_dashboard')) {
      this.go('/cloud/default/dashboard');
    } else {
      this.notify.error("You have not the permission to perform this action.\n" +
                        "Please contact your Manager if you need to achieve this\n" +
                        "action!");
    }
  }
  
  openSalesReport() {
    if (this.authenticate.userCan('access_creport_sale')) {
      this.go('/cloud/default/salereport');
    } else {
      this.notify.error("You have not the permission to perform this action.\n" +
                        "Please contact your Manager if you need to achieve this\n" +
                        "action!");
    }
  }
  
  go(path: string) {
    this.routerActions.go(path);
  }
}
