import {Injectable} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import * as _ from "lodash";
import {NotifyManager} from "../../../services/notify-manager";

@Injectable()
export class FormValidationService {
  
  private stream: {
    validationForm?: Subject<Object>
  } = {};
  
  private _subscriptions: {
    [propName: string]: Subscription;
  } = {};
  
  private _isValid: {
    [propName: string]: boolean;
  } = {};
  
  
  protected validations = [
    {
      id: "require",
      mess: "This is require field"
    },
    {
      id: "email",
      mess: "Email invalid"
    },
    {
      id: "p-number",
      mess: "This is positive number field"
    },
    {
      id: "i-number",
      mess: "This is number field"
    },
    {
      id: "is-number",
      mess: "This is number field"
    },
    {
      id: "p-not-decimal-num",
      mess: "This is integer number field"
    },
    {
      id: "applicant-reference-number",
      mess: "Please input a valid Applicant Reference Number"
    }
  ];
  
  constructor(public toastr: NotifyManager) {
  }
  
  getValidationFormStream() {
    if (!this.stream.hasOwnProperty('validationForm')) {
      this.stream.validationForm = new Subject();
      this.stream.validationForm.asObservable().share();
    }
    return this.stream.validationForm;
  }
  
  /*
   * Submit form
   */
  submit(eventKey, callBack: () => any, forceChangeCallBack: boolean = false): void {
    this._isValid[eventKey] = true;
    if (!this._subscriptions.hasOwnProperty(eventKey) || forceChangeCallBack) {
      if (this._subscriptions.hasOwnProperty(eventKey))
        this._subscriptions[eventKey].unsubscribe();
      this._subscriptions[eventKey] = this.getValidationFormStream()
                                          .filter(object => object['eventKey'] == eventKey)
                                          .subscribe((data) => {
                                            if (this._isValid[eventKey] && !(data.hasOwnProperty('cancel') && data['cancel'] == true)) {
                                              callBack();
                                            } else if (!this._isValid[eventKey]) {
                                              this.toastr.warning('Form Invalid', 'Oops!');
                                            }
                                          });
    }
    this.getValidationFormStream().next({eventKey: eventKey, needValidate: true});
  }
  
  /*
   * Cancel form
   */
  cancel(eventKey, callBack?: () => any): void {
    this._isValid[eventKey] = true;
    if (callBack) {
      callBack();
    }
    this.getValidationFormStream().next({eventKey: eventKey, needValidate: false, cancel: true});
  }
  
  /*
   * Element in form add handle
   */
  onSubmitOrCancel(eventKey: string, whenSubmit: () => boolean, whenCancel?: () => any): Subscription {
    return this.getValidationFormStream()
               .asObservable()
               .filter(object => object['eventKey'] == eventKey)
               .subscribe(
                 (object: Object) => {
                   if (object['needValidate']) {
                     let isValid = whenSubmit();
                     if (!isValid) {
                       this._isValid[eventKey] = isValid;
                     }
                   } else {
                     if (whenCancel)
                       whenCancel();
                   }
                 }
               );
  }
  
  
  validate(validations: string, value: any): Object {
    let validationInfo: Object = {
      isValid: true,
      mess: ""
    };
    let mess: any;
    _.forEach(validations.split(","), (validation) => {
      switch (validation) {
        case "required":
        case "require":
          mess = _.find(this.validations, (v) => v['id'] == 'require');
          if (mess)
            mess = mess['mess'];
          
          if (value === "" || value == null) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? mess : ""
            };
            return false;
          }
          if (_.isArray(value)) {
            if (_.size(value) == 0) {
              validationInfo = {
                isValid: false,
                mess: !!mess ? mess : ""
              };
              return false;
            }else if (_.size(value) == 1 && value[0] == ""){
              validationInfo = {
                isValid: false,
                mess: !!mess ? mess : ""
              };
              return false;
            }
          }
          break;
        case "email":
          mess = _.find(this.validations, (v) => v['id'] == 'email');
          if (mess)
            mess = mess['mess'];
          
          let re       = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          let _isEmail = re.test(value);
          if (_isEmail == false) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? mess : ""
            };
            return false;
          }
          break;
        case "p-number":
          mess = _.find(this.validations, (v) => v['id'] == 'p-number');
          if (mess)
            mess = mess['mess'];
          
          if (value == "" || isNaN(value) || parseFloat(value) <= 0) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? mess : ""
            };
            return false;
          }
          break;
        case "i-number":
          mess = _.find(this.validations, (v) => v['id'] == 'i-number');
          if (mess)
            mess = mess['mess'];
          
          if (isNaN(value) || parseFloat(value) < 0) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? mess : ""
            };
            return false;
          }
          break;
        case "is-number":
          mess = _.find(this.validations, (v) => v['id'] == 'is-number');
          if (mess)
            mess = mess['mess'];
          
          if (isNaN(value) || isNaN(parseFloat(value))) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? mess : ""
            };
            return false;
          }
          break;
        case "p-not-decimal-num":
          mess = _.find(this.validations, (v) => v['id'] == 'p-not-decimal-num');
          if (mess)
            mess = mess['mess'];
          let decimal    = /^(?:[-+]?[0-9]|)+\.[0-9]+$/;
          let _isDecimal = decimal.test(value);
          if (value == "" || isNaN(value) || parseFloat(value) <= 0 || _isDecimal) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? mess : ""
            };
            return false;
          }
          break;
  
        case "applicant-reference-number":
          mess = _.find(this.validations, (v) => v['id'] == 'applicant-reference-number');
          if (mess)
            mess = mess['mess'];
          let reference_number_UK    = /^[G]{1}[W]{1}[F]{1}\d{9}$/;
          let reference_number_SCH   = /^[M]{1}\d{8}$/;
          let reference_number_AUS   = /^[A-Za-z0-9]{3}[-]{1}[A-Za-z0-9]{2}[-]{1}\d{2}[-]{1}\d{6}[-]{1}[A-Za-z0-9]{1}$/;
          let _isReferenceNumberUK  = reference_number_UK.test(value);
          let _isReferenceNumberSCH = reference_number_SCH.test(value);
          let _isReferenceNumberAUS = reference_number_AUS.test(value);
          if (value == "" || (!_isReferenceNumberUK && !_isReferenceNumberSCH && !_isReferenceNumberAUS)) {
            validationInfo = {
              isValid: false,
              mess: !!mess ? (value == "" ? "Please fill the Applicant Reference Number!" : mess) : ""
            };
            return false;
          }
          break;
      }
    });
    return validationInfo;
  }
}
