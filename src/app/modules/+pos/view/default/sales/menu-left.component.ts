import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticateService} from "../../../../../services/authenticate";
import {OfflineService} from "../../../../share/provider/offline";
import {MenuState} from "../../R/sales/menu/menu.state";
import {RetailTranslate} from "../../../../../services/retail-translate";
import {MenuLeftActions} from "../../R/sales/menu/left/left.actions";
import {TranslateService} from "@ngx-translate/core";
import {RouterActions} from "../../../../../R/router/router.actions";
import {AccountActions} from "../../../../../R/account/account.actions";
import {AccountState} from "../../../../../R/account/account.state";
import {DatabaseManager} from "../../../../../services/database-manager";
import {PosGeneralState} from "../../../R/general/general.state";

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
              public retailTranslate: RetailTranslate,
              public menuLeftActions: MenuLeftActions,
              protected routerActions: RouterActions,
              public accountActions: AccountActions,
              protected databaseManager: DatabaseManager) { }
  
  ngOnInit() { }
  
  getUserName() {
    return this.authenticateService.getUserName();
  }
  
  getOutletRegisterData() {
    if (this.generalState.register && this.generalState.outlet) {
      return this.generalState.register['name'] + ' - ' + this.generalState.outlet['name'];
    }
  }
  
  go(path: string) {
    this.routerActions.go(path);
  }
  
  openCart() {
    this.go('pos/default/sales/checkout');
  }
  
  openShift() {
    this.go('pos/default/sales/shifts');
  }
  
  goPosSetting() {
    this.go('pos/configurations/default/general');
  }
  
  changeOutlet() {
    this.go('pos/default/outlet-register');
  }
  
  openOrders() {
    this.go('pos/default/sales/orders');
  }
  
  flushCache() {
    this.databaseManager.deleteDb().then(() => {location.reload(true);});
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
