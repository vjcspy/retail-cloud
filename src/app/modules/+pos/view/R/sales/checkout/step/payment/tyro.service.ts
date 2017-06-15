import {Injectable} from '@angular/core';
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";
import {Subject} from "rxjs";
import * as _ from 'lodash';

@Injectable()
export class TyroService {
  
  private config;
  private iClient: any;
  private tyroStream = new Subject();
  
  getTyroObservable() {
    return this.tyroStream.asObservable();
  }
  
  // Config transaction callback when complete
  transactionCompleteCallback: (response: any) => void = (response) => {
    if (response['result'] == 'APPROVED') {
      
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
                                  })
    } else {
      return this.tyroStream.next({
                                    type: 'error',
                                    data: {isError: true, additionData: {}, response: response}
                                  })
    }
  };
  
  // Config callback to display message
  statusMessageCallback: (message: any) => void = (message) => {
    this.tyroStream.next({
                           type: 'statusMessageCallback',
                           data: {isError: false, additionData: {message}}
                         });
  };
  
  answerCallback: (value) => void;
  
  // Config callback when have a question from tyro
  questionCallback: (question: any, answerCallback: any) => void = (question, answerCallback) => {
    // save answer callback for answer later
    this.answerCallback = (value) => {
      answerCallback(value);
    };
    
    if (question.hasOwnProperty("isError") && question['isError'] == true) {
      this.notify.error(question['text']);
      return this.tyroStream.next({
                                    type: 'error',
                                    data: {isError: true, additionData: {message: question['text']}}
                                  })
    } else {
      let questions = [];
      let message   = '';
      
      if (question.hasOwnProperty("text")) {
        message = question['text'];
      }
      if (_.size(question.options) > 0) {
        _.forEach(question.options, (value) => {
          questions.push({label: value, value: value});
        });
      }
      
      this.tyroStream.next({
                             type: 'questionCallback',
                             data: {isError: false, additionData: {questions, message}}
                           });
    }
  };
  
  receiptCallback: (merchantReceipt) => void = (merchantReceipt) => {
    this.tyroStream.next({
                           type: 'receiptCallback',
                           data: {merchantReceipt: merchantReceipt['merchantReceipt'], isError: false}
                         })
  };
  
  constructor(protected notify: NotifyManager) {
  }
  
  initConfig(tyroPayment) {
    this.config = {
      mid: tyroPayment['payment_data']['mid'],
      tid: tyroPayment['payment_data']['tid'],
      apiKey: tyroPayment['payment_data']['api_key'],
      posProductInfo: {
        posProductVendor: "SMART OSC",
        posProductName: "X-Retail",
        posProductVersion: "1.0.0"
      }
    };
  }
  
  pair() {
    this.getIClientInstance().pairTerminal(this.config.mid, this.config.tid, (response) => {
      console.log("Paring... OK");
      console.log(response);
      
      // if success
      if (response.hasOwnProperty('integrationKey'))
        this.config['integrationKey'] = response['integrationKey'];
    });
    
    return this.config;
  }
  
  getIClientInstance(force: boolean = false): any {
    if (force || typeof this.iClient == "undefined") {
      this.iClient = new TYRO.IClient(this.config.apiKey, this.config.posProductInfo);
    }
    return this.iClient;
  }
  
  doPurchase(amount: string) {
    if (typeof this.transactionCompleteCallback == "undefined"
        || typeof this.statusMessageCallback == "undefined"
        || typeof this.questionCallback == "undefined") {
      throw new GeneralException("Must define callback");
    }
    
    this.getIClientInstance().initiatePurchase({
                                                 amount: amount,
                                                 cashout: "0",
                                                 integratedReceipt: true
                                               }, {
                                                 statusMessageCallback: this.statusMessageCallback,
                                                 questionCallback: this.questionCallback,
                                                 receiptCallback: this.receiptCallback,
                                                 transactionCompleteCallback: this.transactionCompleteCallback
                                               });
  }
  
  doRefund(amount: string) {
    if (typeof this.transactionCompleteCallback == "undefined"
        || typeof this.statusMessageCallback == "undefined"
        || typeof this.questionCallback == "undefined") {
      throw new GeneralException("Must define callback");
    }
    this.getIClientInstance().initiateRefund({
                                               amount: amount,
                                               integratedReceipt: true
                                             }, {
                                               statusMessageCallback: this.statusMessageCallback,
                                               questionCallback: this.questionCallback,
                                               receiptCallback: this.receiptCallback,
                                               transactionCompleteCallback: this.transactionCompleteCallback
                                             });
  }
  
  canel() {
    try {
      this.getIClientInstance().cancelCurrentTransaction();
    } catch (e) {}
    this.getIClientInstance(true);
  }
  
  convertAmount(amount: string): string {
    if (amount.indexOf(".") > -1) {
      if ((amount.length - amount.indexOf(".")) == 3)
        amount = amount.replace(".", "");
      else if ((amount.length - amount.indexOf(".")) == 2) {
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
