import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {FormValidationService} from "../../share/provider/form-validation";

@Component({
             //moduleId: module.id,
             selector: 'date-select',
             templateUrl: 'date.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailDateSelectComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() validation: string = "";
  @Input() formKey: string;
  @ViewChild('dateSelect') elementData: ElementRef;
  
  modelValue;
  private _dateTime;
  protected _validateSubscription: Subscription;
  
  @Output() modelChange = new EventEmitter();
  
  @Input()
  set model(optionValue: any) {
    // remove validate
    this._validateElement(false);
    
    this.modelValue = optionValue;
    this.modelChange.emit(this.modelValue);
  }
  
  get model() {
    return this.modelValue;
  }
  
  protected _validProperty = {
    isValid: true,
    mess: ""
  };
  
  constructor(protected formValidationService: FormValidationService, protected changeDetector: ChangeDetectorRef) {
  }
  
  ngAfterViewInit(): void {
    if (this.model.data_date != null) {
      jQuery(this.elementData.nativeElement)['daterangepicker']({
                                                                  "singleDatePicker": true,
                                                                  "timePicker": 'date',
                                                                  "autoUpdateInput": true,
                                                                  format: 'DD/MM/YYYY',
                                                                  "opens": "center",
                                                                  startDate: this.model.data_date,
                                                                }, (start, end, label) => {
        this._dateTime       = start;
        this.model.month     = start.month();
        this.model.day       = start.date();
        this.model.year      = start.year();
        this.model.data_date = start.format("MM/DD/YYYY");
        this.changeDetector.detectChanges();
      });
    } else {
      jQuery(this.elementData.nativeElement)['daterangepicker']({
                                                                  "singleDatePicker": true,
                                                                  "timePicker": 'date',
                                                                  format: 'DD/MM/YYYY',
                                                                  "autoUpdateInput": false,
                                                                  "opens": "center",
                                                                }, (start, end, label) => {
        this._dateTime       = start;
        this.model.month     = start.month() + 1;
        this.model.day       = start.date();
        this.model.year      = start.year();
        this.model.data_date = start.format("MM/DD/YYYY");
        // this.model = {
        //     month: start.month(),
        //     day: start.date(),
        //     year: start.year(),
        //     data_date: start.format("MM/DD/YYYY"),
        // };
        this.changeDetector.detectChanges();
      });
    }
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
  
  protected _validateElement(needValid): boolean {
    if (!needValid || !this.validation) {
      this._validProperty = {
        isValid: true,
        mess: ""
      };
      this.changeDetector.detectChanges();
      return true;
    } else {
      this._validProperty = <any>this.formValidationService.validate(this.validation, this.model.data_date);
      this.changeDetector.detectChanges();
      return this._validProperty.isValid;
    }
  }
  
  getOutputTime() {
    if (this._dateTime) {
      return this._dateTime.format("MM/DD/YYYY");
    } else
      return "";
  }
  
  triggerDatePicker() {
    jQuery(this.elementData.nativeElement).click();
  }
  
}
