import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import * as _ from "lodash";

@Component({
             //moduleId: module.id,
             selector: 'retail-setting-checkbox',
             templateUrl: 'setting-checkbox.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailSettingCheckboxComponent implements OnInit, AfterViewInit {
  private _model: any;
  
  @Input() data;
  
  @Output() modelChange = new EventEmitter();
  
  @Input()
  set model(optionValue: any) {
    this._model = optionValue;
    this.modelChange.emit(this._model);
  }
  
  get model() {
    return this._model;
  }
  
  constructor(protected elemChangeDetector: ChangeDetectorRef) { }
  
  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    _.forEach(this.data['data'], (option) => {
      if (this.isChecked(option)) {
        option['isChecked'] = true;
      }
    });
    this.elemChangeDetector.detectChanges();
  }
  
  protected isChecked(option) {
    return _.indexOf(this.model, option['value']) > -1;
  }
  
  protected selectOption(option) {
    this.initDefaultValue();
    
    if (this.isChecked(option)) {
      if (_.size(this._model) > 1) {
        _.remove(this._model, (_option) => _option === option['value']);
        option['isChecked'] = false;
      }
    } else {
      this._model.push(option['value']);
      option['isChecked'] = true;
    }
    this.modelChange.emit(this._model);
  }
  
  protected initDefaultValue() {
    if (typeof this.model == "undefined" || !_.isArray(this.model)) {
      this.model = [];
    }
  }
}

