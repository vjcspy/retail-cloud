import {Injectable} from '@angular/core';
import {NotifyManager} from "../../../services/notify-manager";
import {RootActions} from "../../../R/root.actions";

@Injectable()
export class OfflineService {
  private _inited: boolean = false;
  private _online: boolean = true;
  
  constructor(protected notify: NotifyManager, private rootActions: RootActions) {
    Offline.options = {
      checks: {xhr: {url: '/assets/icon/favicon-16x16.png'}},
      // Should we check the connection status immediatly on page load.
      checkOnLoad: false,
      
      // Should we monitor AJAX requests to help decide if we have a connection.
      interceptRequests: false,
      
      // Should we automatically retest periodically when the connection is down (set to false to disable).
      reconnect: {
        // How many seconds should we wait before rechecking.
        initialDelay: 3,
        
      },
      
      // Should we store and attempt to remake requests which fail while the connection is down.
      requests: true,
      
      // Should we show a snake game while the connection is down to keep the user entertained?
      // It's not included in the normal build, you should bring in js/snake.js in addition to
      // offline.min.js.
      game: false
    };
  }
  
  init() {
    if (!this._inited) {
      Offline.on('up', () => {
        this.rootActions.updateNetworkStatus(true);
        this.notify.success("Online");
        this._online = true;
      });
      
      Offline.on('down', () => {
        this.rootActions.updateNetworkStatus(false);
        this.notify.warning("Offline");
        this._online = false;
      });
      
    }
  }
  
  get online(): boolean {
    return this._online;
  }
  
  set online(value: boolean) {
    this.notify.error("Not implement");
  }
}
