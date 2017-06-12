import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Subscription, Subject} from "rxjs";
import * as _ from "lodash";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";
import {TyroService} from "./tyro.service";
import {NotifyManager} from "../../../../../../../../services/notify-manager";


@Component({
             //moduleId: module.id,
             selector: 'checkout-payment-tyro',
             templateUrl: 'tyro.component.html',
             providers: [TyroService]
           })
export class CheckoutTyroComponent implements OnInit, OnDestroy {
  @Input() method: any;
  
  stream = {};
  subscription: {
    [propName: string]: Subscription;
  }      = {};
  
  data = {
    statusMessage: "",
    questions: [],
    answerCallback: null,
    isPaySuccess: false
  };
  
  constructor(protected tyroService: TyroService,
              protected notify: NotifyManager) { }
  
  ngOnInit() {
    this.tyroService.initConfig(this.method);
    this.resetDataPayment();
    this.setHandlePaymentGateway();
  }
  
  
  ngOnDestroy(): void {
    _.forEach(this.subscription, (sub) => sub.unsubscribe());
    _.remove(this.stepViewService.stepPaymentChecker, (checker: any, key: string) => key == 'check_tyro');
  }
  
  cancel() {
    this.tyroService.canel();
    this.stepViewService.viewState['is_paying_gateway'] = false;
    this.resetDataPayment();
    this.stepViewService.stepPaymentChecker['check_tyro'] = () => {
      return true;
    };
    this.stepViewService.removePayment(this.method);
  }
  
  private setHandlePaymentGateway() {
    // show message
    this.tyroService.statusMessageCallback = (message) => {
      this.data['statusMessage'] = message;
    };
    
    // show button when message question
    this.tyroService.questionCallback = (question, answerCallback) => {
      this.data.questions = [];
      if (question.hasOwnProperty("isError") && question['isError'] == true) {
        this.notify.error(question['text']);
        this.tyroService.canel();
        this.resetDataPayment();
        this.stepViewService.viewState['is_paying_gateway'] = false;
      }
      this.data.answerCallback = (value) => {
        answerCallback(value);
      };
      if (question.hasOwnProperty("text")) {
        this.data['statusMessage'] = question['text'];
      }
      if (_.size(question.options) > 0) {
        _.forEach(question.options, (value) => {
          this.data.questions.push({label: value, value: value});
        });
      }
      this.appService.getChangeDetectorStream().next();
    };
    
    // handle complete transaction
    this.tyroService.transactionCompleteCallback = async (response) => {
      if (response['result'] == 'APPROVED') {
        this.data.isPaySuccess = true;
        this.method['data']    = {
          cardType: response['cardType'],
          transactionReference: response['transactionReference'],
          authorisationCode: response['authorisationCode'],
          issuerActionCode: response['issuerActionCode']
        };
        await this.stepViewService.saveOrder();
        
        // if (response.hasOwnProperty('customerReceipt')) {
        //     this.tyroService.print(response['customerReceipt']);
        // }
      } else {
        this.stepViewService.viewState['is_paying_gateway'] = false;
        this.data.isPaySuccess                              = false;
      }
      this.appService.getChangeDetectorStream().next();
    };
    
    
    // set checker in step service when user pay immediately
    if (isNaN(this.method['amount']) || parseFloat(this.method['amount']) == 0) {
      this.translate.get("check_amount_tyro").subscribe(res => this.notify.warning(res));
    } else {
      this.stepViewService.stepPaymentChecker['check_tyro'] = () => {
        if (!this.data.isPaySuccess) {
          this.pay();
          return false;
        }
        else
          return true;
      };
    }
  }
  
  pay() {
    this.resetDataPayment();
    this.setHandlePaymentGateway();
    try {
      let amount: string = this.method['amount'] + "";
      amount             = amount.replace(",", "");
      let isRefund       = false;
      if (amount.indexOf("-") == 0) {
        isRefund = true;
        amount   = amount.replace("-", "");
      }
      
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
      if (isRefund) {
        this.tyroService.doRefund(amount);
      }
      else {
        this.tyroService.doPurchase(amount);
      }
      this.stepViewService.viewState['is_paying_gateway'] = true;
    } catch (e) {
      this.data.statusMessage = e.toString();
    }
  }
  
  private resetDataPayment() {
    this.data = {
      statusMessage: "",
      questions: [],
      answerCallback: null,
      isPaySuccess: false,
    };
  }
  
  protected selectAnswer(value) {
    if (this.data.answerCallback) {
      this.data.answerCallback(value);
      this.resetDataPayment();
      this.stepViewService.viewState['is_paying_gateway'] = false;
    } else {
      throw new GeneralException("Please define answerCallback");
    }
  }
}
