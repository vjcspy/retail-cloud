import {Injectable} from '@angular/core';
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";

@Injectable()
export class TyroService {
  config: any;
  data: any;
  iClient: any;
  
  // Config transaction callback when complete
  transactionCompleteCallback: (response: any) => void;
  
  // Config callback to display message
  statusMessageCallback: (message: any) => void;
  
  // Config callback when have a question from tyro
  questionCallback: (question: any, answerCallback: any) => void;
  
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
      this.config['integrationKey'] = response['integrationKey'];
    });
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
  
  receiptCallback(receipt: any) {
    console.log(receipt);
  }
  
  print(receipt: string) {
    let myWindow = window.open('', '', 'width=600,height=800');
    myWindow.document.write("<pre>" + receipt + "</pre>");
    
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();
  }
}
