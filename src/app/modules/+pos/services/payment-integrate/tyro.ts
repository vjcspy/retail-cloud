import {Injectable} from '@angular/core';
import {NotifyManager} from "../../../../services/notify-manager";

@Injectable()
export class TyroPayment {
  protected config = {
    apiKey: 'provide by tyro',
    posProductInfo: {
      posProductVendor: "SMART OSC",
      posProductName: "X-Retail",
      posProductVersion: "1.0.0"
    }
  };
  private iClient: any;
  
  constructor(private notify: NotifyManager) {}
  
  initConfig(data) {
    this.config = Object.assign({}, this.config, data);
  }
  
  isIntegratedReceipt() {
    return this.config.hasOwnProperty('payment_data') && this.config['payment_data']['integratedReceipt'] === true;
  }
  
  getIClientInstance(force: boolean = false): any {
    if (force || typeof this.iClient === "undefined") {
      this.iClient = new TYRO.IClient(this.config.apiKey, this.config.posProductInfo);
    }
    return this.iClient;
  }
  
  pair(tid, mid, callBack: (response: any) => void) {
    this.config['tid'] = tid;
    this.config['mid'] = mid;
    this.getIClientInstance(true).pairTerminal(this.config['tid'], this.config['mid'], (response) => {
      if (response && response.hasOwnProperty('status') && response['status'] === 'inProgress') {
        this.notify.info(response['message'], 'In Progress');
      }
      if (response && response.hasOwnProperty('status') && response['status'] === 'success') {
        this.notify.success(response['message'], 'Success');
      }
      if (response && response.hasOwnProperty('status') && response['status'] === 'failure') {
        this.notify.error(response['message'], 'Failure');
      }
      callBack(response);
      // if success
      if (response.hasOwnProperty('integrationKey')) {
        this.config['integrationKey'] = response['integrationKey'];
      }
    });
    
    return this.config;
  }
  
  requestTerminalInfo(tid, mid, callBack: (info) => void) {
    if (!tid) {
      tid = this.config['tid'];
    }
    if (!mid) {
      mid = this.config['mid'];
    }
    
    this.getIClientInstance(true).terminalInfo((response) => {
      if (response && response.hasOwnProperty('status') && response['status'] === 'inProgress') {
        this.notify.info(response['message'], 'In Progress');
      }
      if (response && response.hasOwnProperty('status') && response['status'] === 'failure') {
        this.notify.error(response['message'], 'Failure');
      }
      if (response && response.hasOwnProperty('status') && response['status'] === 'success') {
        callBack(response['terminalInfo']);
      }
    }, {tid, mid});
  }
}
