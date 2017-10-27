import {Component, Input, Output, EventEmitter, ElementRef} from '@angular/core';

@Component({
               selector: 'report-multi-select',
               templateUrl: 'select_multi.component.html'
           })
export class CloudReportSelectMultiComponent {
    @Input('elementData') elementData: ElementData;

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
  
    constructor(protected _elementRef: ElementRef ) {}
  
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
