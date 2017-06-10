import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ChangeDetectionStrategy} from '@angular/core';
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
  
  constructor() { }
  
  ngOnInit() {
    if (typeof this.model == "undefined" || !_.isArray(this.model))
      this.model = [];
  }
  
  ngAfterViewInit(): void {
    _.forEach(this.data['data'], (option) => {
      if (this.isChecked(option))
        option['isChecked'] = true;
    });
  }
  
  protected trackBy(index, option) {
    return option['value'];
  }
  
  protected isChecked(option) {
    return _.indexOf(this.model, option['value']) > -1;
  }
  
  protected selectOption(option) {
    if (this.isChecked(option)) {
      if (_.size(this._model) > 1) {
        _.remove(this._model, (_option) => _option == option['value']);
        option['isChecked'] = false;
      }
    } else {
      this._model.push(option['value']);
      option['isChecked'] = true;
    }
    this.model = this._model;
  }
}

