import {Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, OnDestroy} from '@angular/core';
import * as _ from "lodash";
import {Subscription} from "rxjs";
import {isObject} from "rxjs/util/isObject";
import {SalesReportComponent} from "../sales/sales.report";
@Component({
               selector: 'report-select',
               templateUrl: 'select.component.html'
           })
export class ReportSelectComponent {
    @Input('elementData') elementData:ElementData;

    protected modelValue:string | string[];

    @Output() modelChange = new EventEmitter();

    @Input()
    set model(optionValue:any) {
        this.modelValue = optionValue;
        this.modelChange.emit(this.modelValue);
    }

    get model() {
        return this.modelValue;
    }


    constructor(protected _elementRef:ElementRef, protected salesReportComponent:SalesReportComponent) {
    }

    selectedLabel():string {
        if (this.model == null) {
            return "Please select your option";
        } else {

            let option = _.find(this.elementData.data, (option) =>option.value == this.model['value']);
            console.log(option);
            return option ? option.label : "Please select your option";
        }
    }

    protected trackOption(option:Object) {
        return option['id'];
    }

    selectOption(option:Object) {
        console.log(option);
        this.model = option;
        this.salesReportComponent.loadSalesReport();
    }
}
interface ElementData {
    label: string;
    isMultiSelect: boolean;
    data: Option[];
}

interface Option {
    label: string;
    value: any;
    disabled: boolean;
}