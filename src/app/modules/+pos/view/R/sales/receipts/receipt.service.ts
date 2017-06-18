import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable()
export class ReceiptService {
  
  protected receiptSubject = new Subject();
  
  constructor() { }
  
  
  printReceipt() {
    this.receiptSubject.next();
  }
  
  getReceiptObservable() {
    return this.receiptSubject.asObservable().debounceTime(200).share();
  }
}
