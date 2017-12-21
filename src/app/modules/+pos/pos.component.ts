import {ChangeDetectionStrategy, Component, OnInit,OnDestroy} from '@angular/core';
import {posReducer} from "./R/index";
import {OfflineService} from "../share/provider/offline";
import {ReducerManagement} from "../../services/reducer-management";
import {NotifyManager} from "../../services/notify-manager";
import {AppService} from "../../app.service";
import {TranslateService} from "@ngx-translate/core";
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {AccountActions} from "../../R/account/account.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos',
             template: `
               <router-outlet></router-outlet>`,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosComponent implements OnInit, OnDestroy {
  
  timedOut        = false;
  lastPing?: Date = null;
  
  constructor(private reducerManagement: ReducerManagement,
              private offline: OfflineService,
              protected appService: AppService,
              protected accountActions : AccountActions,
              protected translate: TranslateService,
              private notify: NotifyManager,
              protected idle: Idle, private keepalive: Keepalive) {
    this.translate.use('en');
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
    console.log('%c POS v1.0.1.201710201902 ', 'background: #222; color: #bada55');
  }
  
  reset() {
    this.idle.watch();
    this.timedOut  = false;
  }
  
  ngOnInit() {
    let a :boolean = true;
    this.idle.setIdle(15*60);
    // this.idle.setIdle(1*5);
    this.idle.setTimeout(2);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    
    this.idle.onIdleEnd.subscribe(() => console.log('Reset countdown time'));
    this.idle.onTimeout.subscribe(() => {
      console.log( 'Timed out!');
      this.timedOut  = true;
      // idle.stop();
      this.accountActions.autoLogout();
      
      // lỗi không distroy được idle nên khi autologout lần thứ 2 bị subscribe timeout 2 lần.
      if (a === true) {
        this.notify.error("You've been logged out the system. Please log in again to register sales");
        a = false;
      }
    });
    this.idle.onIdleStart.subscribe(() => console.log( 'You\'ve gone CPOS!'));
    this.idle.onTimeoutWarning.subscribe((countdown) => console.log('You will time out in ' + countdown + ' seconds!'));
  
    // sets the ping interval to 1 seconds
    this.keepalive.interval(1);
  
    this.keepalive.onPing.subscribe(() => {
      this.lastPing = new Date();
    });
  
    this.reset();
  }
  
  ngOnDestroy() {
    this.idle.ngOnDestroy();
  }
}
