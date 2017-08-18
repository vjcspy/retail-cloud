import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {RequestService} from "../../../../../../services/request";
import {ApiManager} from "../../../../../../services/api-manager";
import {PosGeneralState} from "../../../../R/general/general.state";

@Injectable()
export class ReceiptService {
  protected receiptSubject = new Subject();
  
  constructor(private request: RequestService, private apiManager: ApiManager) { }
  
  printReceipt() {
    this.receiptSubject.next();
  }
  
  getReceiptObservable() {
    return this.receiptSubject.asObservable().debounceTime(200).share();
  }
  
  sendEmailReceipt(template: string, email: string, name: string, orderOffline: Object, receiptSetting: Object, username: string, inclDiscountPerItemInDiscount: boolean, generalState: PosGeneralState) {
    return this.request.makePost(this.apiManager.get("send-email", generalState.baseUrl), {template, email, name, orderOffline, receiptSetting, username, inclDiscountPerItemInDiscount});
  }
}
