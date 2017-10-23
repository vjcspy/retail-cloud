import {Injectable} from '@angular/core';
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";
import {Subject} from "rxjs";
import * as _ from 'lodash';
import {TyroPayment} from "../../../../../../services/payment-integrate/tyro";

@Injectable()
export class TyroService {
  
  private tyroStream = new Subject();
  
  constructor(private tyroPayment: TyroPayment,
              protected notify: NotifyManager) {}
  
  getTyroObservable() {
    return this.tyroStream.asObservable();
  }
  
  // Config transaction callback when complete
  transactionCompleteCallback: (response: any) => void = (response) => {
    if (response['result'] === 'APPROVED') {
      
      let customerReceipt;
      if (response.hasOwnProperty('customerReceipt')) {
        customerReceipt = response['customerReceipt'];
      }
      return this.tyroStream.next({
                                    type: 'transactionCompleteCallback',
                                    data: {
                                      isError: false,
                                      additionData: {
                                        cardType: response['cardType'],
                                        transactionReference: response['transactionReference'],
                                        authorisationCode: response['authorisationCode'],
                                        issuerActionCode: response['issuerActionCode']
                                      },
                                      customerReceipt
                                    }
                                  });
    } else {
      return this.tyroStream.next({
                                    type: 'error',
                                    data: {isError: true, additionData: {}, response}
                                  });
    }
  }
  
  // Config callback to display message
  statusMessageCallback: (message: any) => void = (message) => {
    this.tyroStream.next({
                           type: 'statusMessageCallback',
                           data: {isError: false, additionData: {message}}
                         });
  }
  
  answerCallback: (value) => void;
  
  // Config callback when have a question from tyro
  questionCallback: (question: any, answerCallback: any) => void = (question, answerCallback) => {
    // save answer callback for answer later
    this.answerCallback = (value) => {
      answerCallback(value);
    };
    
    // if (question.hasOwnProperty("isError") && question['isError'] === true && false) {
    //   this.notify.error(question['text']);
    //   return this.tyroStream.next({
    //                                 type: 'error',
    //                                 data: {isError: true, additionData: {message: question['text']}}
    //                               });
    // } else {
    let questions = [];
    let message   = '';
    
    if (question.hasOwnProperty("text")) {
      message = question['text'];
    }
    if (_.size(question.options) > 0) {
      _.forEach(question.options, (value) => {
        questions.push({label: value, value});
      });
    }
    
    this.tyroStream.next({
                           type: 'questionCallback',
                           data: {isError: false, additionData: {questions, message}}
                         });
    // }
  }
  
  receiptCallback: (merchantReceipt) => void = (merchantReceipt) => {
    this.tyroStream.next({
                           type: 'receiptCallback',
                           data: {merchantReceipt: merchantReceipt['merchantReceipt'], isError: false}
                         });
  }
  
  getIClientInstance(force: boolean = false): any {
    return this.tyroPayment.getIClientInstance(force);
  }
  
  doPurchase(amount: string) {
    this.checkInitCallBack();
    
    this.getIClientInstance(true).initiatePurchase({
                                                 amount,
                                                 cashout: "0",
                                                 integratedReceipt: this.tyroPayment.isIntegratedReceipt()
                                               }, {
                                                 statusMessageCallback: this.statusMessageCallback,
                                                 questionCallback: this.questionCallback,
                                                 receiptCallback: this.receiptCallback,
                                                 transactionCompleteCallback: this.transactionCompleteCallback
                                               });
  }
  
  doRefund(amount: string) {
    this.checkInitCallBack();
    
    this.getIClientInstance(true).initiateRefund({
                                               amount,
                                               integratedReceipt: this.tyroPayment.isIntegratedReceipt()
                                             }, {
                                               statusMessageCallback: this.statusMessageCallback,
                                               questionCallback: this.questionCallback,
                                               receiptCallback: this.receiptCallback,
                                               transactionCompleteCallback: this.transactionCompleteCallback
                                             });
  }
  
  protected checkInitCallBack() {
    if (typeof this.transactionCompleteCallback === "undefined"
        || typeof this.statusMessageCallback === "undefined"
        || typeof this.questionCallback === "undefined") {
      throw new GeneralException("Must define callback");
    }
  }
  
  canel() {
    try {
      this.getIClientInstance().cancelCurrentTransaction();
    } catch (e) {
      console.log(e);
    }
    this.getIClientInstance(true);
  }
  
  convertAmount(amount: string): string {
    if (amount.indexOf(".") > -1) {
      if ((amount.length - amount.indexOf(".")) === 3) {
        amount = amount.replace(".", "");
      } else if ((amount.length - amount.indexOf(".")) === 2) {
        amount = amount.replace(".", "");
        amount += "0";
      } else {
        throw new GeneralException("Price wrong format");
      }
    } else {
      amount += "00";
    }
    return amount;
  }
}
