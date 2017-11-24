import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AccountState} from "../../../../R/account/account.state";
import {AuthenticateService} from "../../../../services/authenticate";
import {Router} from "@angular/router";
import {RouterActions} from "../../../../R/router/router.actions";
import {MenuState} from "../../R/menu/state";
import * as _ from 'lodash';
import {MenuActions} from "../../R/menu/actions";

@Component({
             // moduleId: module.id,
             selector: 'sidebar-component',
             templateUrl: 'sidebar.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class SidebarComponent implements OnInit {
  @Input() accountState: AccountState;
  @Input() menuState: MenuState;
  
  openingSubmenuName: string = '';
  
  constructor(public authenticate: AuthenticateService,
              public router: Router,
              public routerActions: RouterActions,
              public menuActions: MenuActions) { }
  
  ngOnInit() { }
  
  openSubmenu(item: Object) {
    if (_.isArray(item['children']) && _.size(item['children']) > 0) {
      this.openingSubmenuName = this.openingSubmenuName !== item['name'] ? item['name'] : '';
    }
  }
}
