import {Component, OnInit, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import * as _ from "lodash";
import * as moment from 'moment';
import {SaleReportService} from "../../+cloud/R/report/service";

@Component({
               // moduleId: module.id,
               selector: 'date-compare-item',
               templateUrl: 'date-compare-item.component.html'
           })
export class CloudReportDateCompareItemComponent implements OnInit,AfterViewInit {
    @Input('value') value: any;
    @Input('label') label: string;

    protected modelData: any[];

    @Input()
    set model(optionValue: any[]) {
        this.modelData = optionValue;
        this.modelChange.emit(this.modelData);
    }
  
    @Output() modelChange = new EventEmitter();

    get model() {
        return this.modelData;
    }

    listYear: any;
    yearSelected: any;
    listQuarter: any;
    quarterSelected: any;


    yearSelect: any;
    quarterSelect: any;
    monthSelect: any;
    weekSelect: any;
    dateSelect: any;
    hourSelect: any;

    ngOnInit() {}

    ngAfterViewInit(): void {
        $("#selectYearData")['combodate']({
                                              firstItem: moment().format('YYYY'),
                                              customClass: "form-control",
                                              minYear: moment().subtract(10, 'year').format('YYYY'),
                                              maxYear: moment().format('YYYY'),
                                              format: "YYYY",
                                              template: "YYYY",
                                              value: moment().format('YYYY'),
                                          });

        $("#selectMonthData")['combodate']({
                                               firstItem: moment().format('MM-YYYY'),
                                               customClass: "form-control",
                                               minYear: moment().subtract(10, 'year').format('YYYY'),
                                               maxYear: moment().format('YYYY'),
                                               format: "MM-YYYY",
                                               template: "MMM YYYY",
                                              // for case view full report from init selected month dashboard
                                               value: this.service.viewDataFilter['compare_from'] ? this.service.viewDataFilter['compare_from'].format('MM-YYYY') : moment().format('MM-YYYY')
                                           });

        $("#selectWeekData")['combodate']({
                                              smartDays : true,
                                              firstItem: moment().format('DD-MM-YYYY'),
                                              customClass: "form-control",
                                              minYear: moment().subtract(10, 'year').format('YYYY'),
                                              maxYear: moment().format('YYYY'),
                                              format: "DD-MM-YYYY",
                                              template: "DD MMM YYYY",
                                            // for case view full report init selected week from dashboard
                                              value: this.service.viewDataFilter['compare_from'] ? this.service.viewDataFilter['compare_from'].format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')
                                          });
        $("#selectDayData")['combodate']({
                                             smartDays :true,
                                             firstItem: moment().format('DD-MM-YYYY'),
                                             customClass: "form-control",
                                             minYear: moment().subtract(10, 'year').format('YYYY'),
                                             maxYear: moment().format('YYYY'),
                                             format: "DD-MM-YYYY",
                                             template: "DD MMM YYYY",
                                           // for case view full report init selected day from dashboard
                                             value: this.service.viewDataFilter['compare_from'] ? this.service.viewDataFilter['compare_from'].format('DD-MM-YYYY') : moment().format('DD-MM-YYYY')
                                         });
        $("#selectHourData")['combodate']({
                                              smartDays :true,
                                              firstItem: moment().format('DD-MM-YYYY h:mm a'),
                                              customClass: "form-control",
                                              minYear: moment().subtract(10, 'year').format('YYYY'),
                                              maxYear: moment().format('YYYY'),
                                              format: "DD-MM-YYYY h:mm a",
                                              template: "DD MMM YYYY   h mm a",
                                              value: moment().format('DD-MM-YYYY h:mm a')
                                          });
    }

    constructor(protected service: SaleReportService) {
        this.getDefaultQuarter();
    }


    handleUpdateDateCompare(type: string) {
        this.model['compare_value'] = this.value;
        this.model['compare_type']  = type;
        let data_compare_count      = this.model['compare_count'] - 1;
        switch (type) {
            case "to_date" :
                if (this.value == "hour") {
                    this.model['dateEnd']   = moment().format("YYYY-MM-DD H:mm:ss");
                    this.model['dateStart'] = moment().startOf(this.value).format("YYYY-MM-DD H:mm:ss");
                } else {
                    this.model['dateEnd']   = moment().format("YYYY-MM-DD 23:59:59");
                    this.model['dateStart'] = moment().startOf(this.value).format("YYYY-MM-DD 00:00:00");
                }
                break;
            case "last" :
                if (this.value == 'hour') {
                    this.model['dateEnd']   = moment().endOf(this.value).format("YYYY-MM-DD H:mm:ss");
                    this.model['dateStart'] =
                        moment().subtract(data_compare_count, this.value).startOf(this.value).format("YYYY-MM-DD H:mm:ss");
                } else {
                    this.model['dateEnd']   = moment().endOf(this.value).format("YYYY-MM-DD 23:59:59");
                    this.model['dateStart'] =
                        moment().subtract(data_compare_count , this.value).startOf(this.value).format("YYYY-MM-DD 00:00:00");
                }
                break;
            case "last_from" :
                if (this.value == 'year') {
                    this.yearSelect         = $("#selectYearData")['combodate']('getValue', 'YYYY');
                    this.model['dateStart'] = moment(this.yearSelect, "YYYY").startOf(this.value).format("YYYY-MM-DD 00:00:00");
                }
                if (this.value == 'quarter') {
                    this.model['dateStart'] =
                        moment().set({'month': this.quarterSelected - 1 , 'year': this.yearSelected}).startOf('month').format("YYYY-MM-DD 00:00:00");
                }
                if (this.value == 'month') {
                    this.monthSelect        = $("#selectMonthData")['combodate']('getValue', 'MM-YYYY');
                    this.model['dateStart'] = moment(this.monthSelect, "MM-YYYY").startOf(this.value).format("YYYY-MM-DD 00:00:00");
                }
                if (this.value == 'week') {
                    this.weekSelect         = $("#selectWeekData")['combodate']('getValue', 'DD-MM-YYYY');
                    this.model['dateStart'] = moment(this.weekSelect, "DD-MM-YYYY").startOf(this.value).format('YYYY-MM-DD 00:00:00');
                }
                if (this.value == 'day') {
                    this.dateSelect         = $("#selectDayData")['combodate']('getValue', 'DD-MM-YYYY');
                    this.model['dateStart'] = moment(this.dateSelect, "DD-MM-YYYY").format('YYYY-MM-DD 00:00:00');
                    this.model['dateStart'] = moment(this.dateSelect, "DD-MM-YYYY").format('YYYY-MM-DD 00:00:00');
                }
                if (this.value == 'hour') {
                    this.hourSelect         = $("#selectHourData")['combodate']('getValue', 'DD-MM-YYYY h:mm a');
                    this.model['dateStart'] = moment(this.hourSelect, 'DD-MM-YYYY h:mm a').format('YYYY-MM-DD H:mm:ss');
                    this.model['dateEnd']   = moment(this.model['dateStart']).add(data_compare_count, this.value).endOf(this.value).format("YYYY-MM-DD H:mm:ss");
                } else {
                    this.model['dateEnd'] =
                        moment(this.model['dateStart']).add(data_compare_count, this.value).endOf(this.value).format("YYYY-MM-DD 23:59:59");
                }
                break;
        }
    }

    protected isCheck(type:string) {
        if (this.value == this.model['compare_value'] && type == this.model['compare_type']) {
            return true;
        }
        return false;
    }


    protected getDefaultQuarter(): void {
        if (this.yearSelected == null) {
            let year          = _.find(this.getYearSize()['data'], (year) => year['value'] == moment().format('YYYY'));
            this.yearSelected = year['value'];
        }
        if (this.quarterSelected == null) {
            let quarter          = _.find(this.getQuarterSize()['data'], (quarter) =>quarter['id'] == moment().quarter());
            this.quarterSelected = quarter['value'];
        }
    }


    protected getQuarterSize() {
        if (this.listQuarter == null) {
            this.listQuarter = [
                {id: "1", label: "Q1", value: "1"},
                {id: "2", label: "Q2", value: "4"},
                {id: "3", label: "Q3", value: "7"},
                {id: "4", label: "Q4", value: "10"},
            ];
        }
        return {
            data: this.listQuarter,
            isMultiSelect: false,
            label: "quarter_size",
            value: "quarter_size"
        }
    }

    protected getYearSize() {
        if (this.listYear == null) {
            this.listYear = [];
            let data      = [];
            for (let y = 0; y < 10; y++) {
                data          = [];
                data['id']    = y;
                data['value'] = moment().subtract(y, 'year').format('YYYY');
                data['label'] = data['value'];
                this.listYear.push(data);
            }
        }
        return {
            data: this.listYear,
            isMultiSelect: false,
            label: "year_size",
            value: "year_size"
        };
    }

}
