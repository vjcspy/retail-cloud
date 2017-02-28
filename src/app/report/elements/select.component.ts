import {Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener, OnDestroy} from '@angular/core';
import * as _ from "lodash";
import {Subscription} from "rxjs";
import {isObject} from "rxjs/util/isObject";
import {SalesReportComponent} from "../sales/sales.report";
import {DashboardReportComponent} from "../dashboard/dashboard.report";
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


    constructor(protected _elementRef:ElementRef, protected dashboardReport:DashboardReportComponent) {
    }

    selectedLabel():string {
        if (this.model == null) {
            return "Please select your option";
        } else {

            let option = _.find(this.elementData.data, (option) =>option.value == this.model['value']);
            return option ? option.label : "Please select your option";
        }
    }

    protected trackOption(option:Object) {
        return option['id'];
    }

    selectOption(option:Object) {
        this.model = option;
        if (this.elementData.site == "dashboard") {
            this.dashboardReport.loadDashboardReport();
        }
        // this.salesReportComponent.loadSalesReport();
    }
}
interface ElementData {
    label:string;
    isMultiSelect:boolean;
    data:Option[];
    site:string;
}

interface Option {
    label:string;
    value:any;
    disabled:boolean;
}