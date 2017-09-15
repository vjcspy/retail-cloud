import {
  Component, OnInit, Input, Output, EventEmitter, ElementRef, OnDestroy, AfterViewInit, ViewChild, ChangeDetectionStrategy
} from '@angular/core';
import {Subscription} from "rxjs";
import * as moment from "moment";
import {FormValidationService} from "../../share/provider/form-validation";

@Component({
             //moduleId: module.id,
             selector: 'time-select',
             templateUrl: 'time.component.html',
             // changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailTimeSelectComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() validation: string = "";
  @Input() formKey: string;
  @ViewChild('timeSelect') elementData: ElementRef;
  
  modelValue;
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
  
  constructor(protected formValidationService: FormValidationService) {
  
  }
  
  ngAfterViewInit(): void {
    if (this.model.data_time != null) {
      jQuery(this.elementData.nativeElement)['datetimepicker']({
                                                                 format: 'hh:mm a',
                                                                 defaultDate: moment(this.model.data_time).format(),
                                                               }).on("dp.change", (event) => {
        this.model['hour']      = event.date.format('hh');
        this.model['minute']    = event.date.format('mm');
        this.model['day_part']  = event.date.format('a');
        // this.model['data_time'] = event.date.seconds(0).milliseconds(0).format();
        this.model['data_time'] = event.date.seconds(0).format();
      });
    } else {
      jQuery(this.elementData.nativeElement)['datetimepicker']({
                                                                 format: 'hh:mm a',
                                                               }).on("dp.change", (event) => {
        // this.model = {
        //     hour: event.date.format('hh'),
        //     minute: event.date.format('mm'),
        //     day_part: event.date.format('a'),
        //     data_time : event.date.format()
        // };
        this.model['hour']      = event.date.format('hh');
        this.model['minute']    = event.date.format('mm');
        this.model['day_part']  = event.date.format('a');
        // this.model['data_time'] = event.date.milliseconds(0).format();
        this.model['data_time'] = event.date.seconds(0).format();
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
      return true;
    } else {
      this._validProperty = <any>this.formValidationService.validate(this.validation, this.model.data_time);
      return this._validProperty.isValid;
    }
  }
}

