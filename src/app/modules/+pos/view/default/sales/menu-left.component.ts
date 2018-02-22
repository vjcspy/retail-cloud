import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticateService} from "../../../../../services/authenticate";
import {OfflineService} from "../../../../share/provider/offline";
import {MenuState} from "../../R/sales/menu/menu.state";
import {MenuLeftActions} from "../../R/sales/menu/left/left.actions";
import {TranslateService} from "@ngx-translate/core";
import {RouterActions} from "../../../../../R/router/router.actions";
import {AccountActions} from "../../../../../R/account/account.actions";
import {AccountState} from "../../../../../R/account/account.state";
import {PosGeneralState} from "../../../R/general/general.state";
import {AccountService} from "../../../../../R/account/account.service";
import {NotifyManager} from "../../../../../services/notify-manager";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-menu-left',
             templateUrl: 'menu-left.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultMenuLeftComponent implements OnInit {
  @ViewChild('menuElem') menuElem: ElementRef;
  @Input() menuState: MenuState;
  @Input() accountState: AccountState;
  @Input() generalState: PosGeneralState;
  
  constructor(public authenticateService: AuthenticateService,
              public offline: OfflineService,
              public translate: TranslateService,
              public menuLeftActions: MenuLeftActions,
              protected routerActions: RouterActions,
              public accountActions: AccountActions,
              private notify: NotifyManager,
              protected accountService: AccountService) { }
  
  ngOnInit() { }
  
  getUserName() {
    return this.authenticateService.getUserName();
  }
  
  getOutletRegisterData() {
    if (this.generalState.register && this.generalState.outlet) {
      return this.generalState.outlet['name'] + ' - ' + this.generalState.register['name'];
    }
  }
  
  go(path: string) {
    this.routerActions.go(path);
  }
  
  openCart() {
    // if (this.authenticateService.userCan('access_to_connectpos')) {
      this.go('pos/default/sales/checkout');
    // } else {
    //   this.notify.error("not_have_permission_to_access_to_connectpos");
    // }
  }
  
  openShift() {
    // if (this.authenticateService.userCan('view_register')) {
      if (this.offline.online) {
        this.go('pos/default/sales/shifts');
      }
    // } else {
    //   this.notify.error("not_have_permission_to_view_register");
    // }
  }
  
  goPosSetting() {
    // if (this.authenticateService.userCan('access_to_connectpos_settings')) {
      if (this.offline.online) {
        this.go('pos/configurations/default/general');
      }
    // } else {
    //   this.notify.error("not_have_permission_to_access_to_connectpos_settings");
    // }
  }
  
  changeOutlet() {
    if (this.offline.online) {
      this.go('pos/default/outlet-register');
    }
  }
  
  openOrders() {
    // if (this.authenticateService.userCan('view_order_list')) {
      this.go('pos/default/sales/orders');
    // } else {
    //   this.notify.error("not_have_permission_to_view_order_list");
    // }
  }
  
  flushCache() {
    if (this.offline.online) {
      this.go('pos/configurations/default/advanced/client-db');
    }
  }
  
  logOut() {
    if (this.offline.online) {
      this.accountService.removeUserFromStorage();
      this.accountActions.logout();
    }
  }
  
  @HostListener('document:click', ['$event.target']) onClick(target) {
    // if (screenfull.enabled && this.appService.viewState.firstTimeFullScreen) {
    //   this.appService.viewState.firstTimeFullScreen = false;
    //   screenfull.request();
    // }
    
    if (target.className.indexOf('menu-toggle') > -1 || target.className.indexOf('amenu') > -1) {
      return;
    }
    if (this.menuElem && !this.menuElem.nativeElement.contains(target)) {
      if (this.menuState.leftMenu.isOpen === true) {
        this.menuLeftActions.changeOpenState(false);
      }
    }
  }
}
