import {Component, Input, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
import * as _ from "lodash";

@Component({
             // moduleId: module.id,
             selector: 'report-select2',
             templateUrl: 'report-select2.component.html',
             styleUrls: ['report-select2.component.scss']
           })
export class ReportSelect2Component implements AfterViewInit {
  @Input('elementData') elementData: any;
  @Input() formKey: string;
  @Input() disabled: boolean  = false;
  @Input() multiple: boolean  = false;
  @ViewChild("selectElem") selectElem: ElementRef;
  
  protected modelValue: string | string[];
  
  @Output() modelChange = new EventEmitter();
  
  @Input()
  set model(optionValue: string | string[]) {
    
    this.modelValue = optionValue;
    this.modelChange.emit(this.modelValue);
  }
  
  get model() {
    return this.modelValue;
  }
  
  constructor(protected _elementRef: ElementRef) {}
  
  ngAfterViewInit(): void {
      let vm = this;
      if (this.selectElem.nativeElement) {
          let _e = jQuery(this.selectElem.nativeElement);
          _e['select2']()
              .on('change', function () {
                  vm.model = <any>jQuery(this).val();
              });
          if (this.multiple === true) {
              _e.val(this.model).trigger("change");
          }
      }
  }
  
  isSelected(value) {
      if (this.multiple === true) {
          if (_.isArray(this.model)) {
              return _.indexOf(this.model, value) > -1;
          } else {
              return false;
          }
      } else {
          return this.model == value;
      }
  }
  
  protected trackOption(index: number, option: Object) {
    return option['value'];
  }
}
