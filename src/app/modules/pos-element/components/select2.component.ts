import {
  Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy
} from '@angular/core';
import {Subscription} from "rxjs";
import {FormValidationService} from "../../share/provider/form-validation";
import {GeneralException} from "../../+pos/core/framework/General/Exception/GeneralException";

@Component({
             // moduleId: module.id,
             encapsulation: ViewEncapsulation.None,
             selector: 'retail-select2',
             templateUrl: 'select2.component.html',
             styleUrls: ['select2.component.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailSelect2Component implements OnInit, AfterViewInit {
  @Input('elementData') elementData: any;
  @Input() formKey: string;
  @Input() disabled: boolean  = false;
  @Input() validation: string = "";
  @ViewChild("selectElem") selectElem: ElementRef;
  
  protected _validProperty = {
    isValid: true,
    mess: ""
  };
  protected _validateSubscription: Subscription;
  
  protected modelValue: string | string[];
  
  @Output() modelChange = new EventEmitter();
  
  @Input()
  set model(optionValue: string | string[]) {
    // remove validate
    this._validateElement(false);
    
    this.modelValue = optionValue;
    this.modelChange.emit(this.modelValue);
  }
  
  get model() {
    return this.modelValue;
  }
  
  constructor(protected _elementRef: ElementRef, protected formValidationService: FormValidationService) {
  }
  
  ngOnInit() {
    // for form validation
    this._validateSubscription = this.formValidationService
                                     .onSubmitOrCancel(
                                       this.formKey,
                                       () => this._validateElement(true),
                                       () => this._validateElement(false)
                                     );
  }
  
  ngOnDestroy(): void {
    if (typeof this._validateSubscription != "undefined")
      this._validateSubscription.unsubscribe();
  }
  
  
  ngAfterViewInit(): void {
    let vm = this;
    if (this.selectElem.nativeElement) {
      jQuery(this.selectElem.nativeElement)
        ['select2']()
        .on('change', function () {
          vm.model = <any>jQuery(this).val();
        });
    }
    else {
      throw new GeneralException("Can't create retail-select2 component");
    }
  }
  
  protected _validateElement(needValid): boolean {
    if (!needValid || !this.validation) {
      this._validProperty = {
        isValid: true,
        mess: ""
      };
      return true;
    } else {
      this._validProperty = <any>this.formValidationService.validate(this.validation, this.model);
      return this._validProperty.isValid;
    }
    
  }
  
  protected trackOption(index: number, option: Object) {
    return option['value'];
  }
}
