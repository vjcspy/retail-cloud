import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import * as _ from "lodash";

@Component({
             //moduleId: module.id,
             selector: 'retail-setting-radio',
             templateUrl: 'setting-radio.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailSettingRadioComponent implements OnInit {
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
        return false;
      }
    });
    this.elemChangeDetector.detectChanges();
  }
  
  protected isChecked(option) {
    return option['value'] == this.model;
  }
  
  protected selectOption(option) {
    this.model = option['value'];
    _.forEach(this.data['data'], (option) => {option['isChecked'] = false});
    option['isChecked'] = true;
  }
  
}
