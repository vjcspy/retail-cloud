import {ChangeDetectionStrategy, Component} from '@angular/core';
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
export class PosComponent {
  timedOut        = false;
  lastPing?: Date = null;
  
  constructor(private reducerManagement: ReducerManagement,
              private offline: OfflineService,
              protected appService: AppService,
              protected accountActions : AccountActions,
              protected translate: TranslateService,
              private notify: NotifyManager,
              private idle: Idle, private keepalive: Keepalive) {
    this.translate.use('en');
    this.reducerManagement.replaceReducer('posReducer', posReducer());
    this.offline.init();
    console.log('%c POS v1.0.1.201710201902 ', 'background: #222; color: #bada55');
    
    idle.setIdle(5*60);
    
    
    idle.setTimeout(2);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    
    idle.onIdleEnd.subscribe(() => console.log('Reset countdown time'));
    idle.onTimeout.subscribe(() => {
     console.log( 'Timed out!');
      this.timedOut  = true;
      this.accountActions.logout();
    });
    idle.onIdleStart.subscribe(() =>console.log( 'You\'ve gone CPOS!'));
    idle.onTimeoutWarning.subscribe((countdown) => console.log('You will time out in ' + countdown + ' seconds!'));
    
    // sets the ping interval to 15 seconds
    // keepalive.interval(1);
    
    keepalive.onPing.subscribe(() => this.lastPing = new Date());
    
    this.reset();
  }
  
  reset() {
    this.idle.watch();
    this.timedOut  = false;
  }
}
