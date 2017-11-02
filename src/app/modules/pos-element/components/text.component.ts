import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Subscription} from "rxjs";
import {FormValidationService} from "../../share/provider/form-validation";

@Component({
             //moduleId: module.id,
             selector: 'retail-text',
             templateUrl: 'text.component.html',
             // changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailTextComponent implements OnInit, OnDestroy {
  @Input() typeElem: string   = 'text';
  @Input() validation: string = "";
  @Input() formKey: string;
  @Input() disabled           = false;
  @Input('placeHolderText') placeHolderText: string;
  
  modelValue: string;
  
  protected _validateSubscription: Subscription;
  
  @Output() modelChange = new EventEmitter();
  
  @Input()
  set model(optionValue: string) {
    // remove validate
    this._validateElement(false);
    if (optionValue === null || typeof optionValue === 'undefined') {
      optionValue = '';
    }
    this.modelValue = optionValue;
  }
  
  changeValue(value) {
    // remove validate
    this._validateElement(false);
    this.modelChange.emit(value);
  }
  
  get model() {
    return this.modelValue;
  }
  
  protected _validProperty = {
    isValid: true,
    mess: ""
  };
  
  
  constructor(protected formValidationService: FormValidationService) { }
  
  ngOnInit() {
    this._validateSubscription = this.formValidationService
                                     .onSubmitOrCancel(
                                       this.formKey,
                                       () => this._validateElement(true),
                                       () => this._validateElement(false)
                                     );
  }
  
  ngOnDestroy(): void {
    if (typeof this._validateSubscription)
      this._validateSubscription.unsubscribe();
  }
  
  protected _validateElement(needValid): boolean {
    if (!needValid || !this.validation) {
      this._validProperty = {
        isValid: true,
        mess: ""
      };
      return true;
    } else {
      this._validProperty = <any>this.formValidationService.validate(this.validation, this.modelValue);
      return this._validProperty.isValid;
    }
    
  }
}
