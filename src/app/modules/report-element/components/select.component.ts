import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';
@Component({
               selector: 'report-select',
               templateUrl: 'select.component.html'
           })
export class CloudReportSelectComponent {
    @Input('elementData') elementData: ElementData;

    protected modelValue: string | string[];

    @Output() modelChange = new EventEmitter();

    @Input()
    set model(optionValue:any) {
        this.modelValue = optionValue;
        this.modelChange.emit(this.modelValue);
    }

    get model() {
        return this.modelValue;
    }
  
    constructor(protected _elementRef: ElementRef ) {

    }
  
    protected trackOption(option: Object) {
        return option['id'];
    }
}
interface ElementData {
    label: string;
    value: string;
    isMultiSelect: boolean;
    data: any[];
}

interface Option {
    id: number;
    label: string;
    value: string;
}
