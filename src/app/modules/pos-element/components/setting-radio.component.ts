import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import * as _ from "lodash";

@Component({
               //moduleId: module.id,
               selector: 'retail-setting-radio',
               templateUrl: 'setting-radio.component.html'
           })
export class RetailSettingRadioComponent implements OnInit {
    private _model: any;
    private isActive      = false;
    protected _selectText = "Choose an option";

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
        if (typeof this.model == "undefined")
            this.model = "";
    }

    ngAfterViewInit(): void {
        _.forEach(this.data['data'], (option) => {
            if (this.isChecked(option)) {
                option['isChecked'] = true;
                this._selectText    = option['label'];
                return false;
            }
        });
    }

    protected trackBy(index, option) {
        return option['value'];
    }

    protected isChecked(option) {
        return option['value'] == this.model;
    }

    protected selectOption(option) {
        this.model = option['value'];
        _.forEach(this.data['data'], (option) => {option['isChecked'] = false});
        option['isChecked'] = true;
        this._selectText    = option['label'];
        this.isActive       = false;
    }

}