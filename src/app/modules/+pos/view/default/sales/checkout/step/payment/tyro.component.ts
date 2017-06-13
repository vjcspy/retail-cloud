import {Component, OnInit, Input} from '@angular/core';
import * as _ from "lodash";
import {GeneralException} from "../../../../../../core/framework/General/Exception/GeneralException";
import {TyroService} from "./tyro.service";
import {NotifyManager} from "../../../../../../../../services/notify-manager";
import {PosStepActions} from "../../../../../R/sales/checkout/step/step.actions";
import {PosStepService} from "../../../../../R/sales/checkout/step/step.service";
import {PaymentMethod, PosStepState} from "../../../../../R/sales/checkout/step/step.state";


@Component({
             //moduleId: module.id,
             selector: 'checkout-payment-tyro',
             templateUrl: 'tyro.component.html',
             providers: [TyroService]
           })
export class CheckoutTyroComponent implements OnInit {
  @Input() method: PaymentMethod;
  @Input() posStepState: PosStepState;
  
  data = {
    statusMessage: "",
    questions: [],
    answerCallback: null,
    isPaySuccess: false
  };
  
  constructor(protected tyroService: TyroService,
              protected notify: NotifyManager,
              protected posStepActions: PosStepActions,
              protected posStepService: PosStepService) { }
  
  ngOnInit() {
    this.tyroService.initConfig(this.method);
    this.resetDataPayment();
    this.initHandleCallBackFromTyro();
  }
  
  changeAmount(value) {
    value += '';
    if (isNaN(value) || !value) {
      value = 0;
    }
    if (value.indexOf(".") === (value.length - 1) || value.indexOf(",") === (value.length - 1)) {
      return;
    }
    
    this.posStepActions.changeAmountPayment(this.method, parseFloat(value));
  }
  
  cancel() {
    this.tyroService.canel();
    this.resetDataPayment();
    this.posStepService.removeTaskBeforeSaveOrder(this.method.type);
    this.posStepActions.removePaymentMethodFromOrder(this.method);
  }
  
  private initHandleCallBackFromTyro() {
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
        
        // if (response.hasOwnProperty('customerReceipt')) {
        //     this.tyroService.print(response['customerReceipt']);
        // }
      } else {
        this.data.isPaySuccess = false;
      }
    };
    
    // set checker in step service when user pay immediately
    if (isNaN(this.method['amount']) || parseFloat(this.method['amount'] + '') == 0) {
      this.notify.warning('check_amount_tyro');
    } else {
      this.posStepService.addTaskBeforeSaveOrder(this.method.type, () => {
        if (!this.data.isPaySuccess) {
          this.pay();
          return false;
        }
        else {
          return true;
        }
      });
    }
  }
  
  pay() {
    this.resetDataPayment();
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
    } else {
      throw new GeneralException("Please define answerCallback");
    }
  }
}
