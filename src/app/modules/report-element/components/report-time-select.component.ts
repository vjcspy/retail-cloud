import {Component, HostListener, ViewChild, ElementRef, Input, EventEmitter, Output, AfterViewInit} from '@angular/core';
import * as moment from "moment";
import {FormValidationService} from "../../share/provider/form-validation";
import {SaleReportService} from "../../+cloud/R/report/service";

@Component({
               selector: 'report-time-select',
               templateUrl: 'report-time-select.component.html'
           })
export class CloudReportTimeSelectComponent implements AfterViewInit {
    @ViewChild('dateRangerr') dateRangerr: ElementRef;
    @ViewChild('dateTimeElem') noteElem: ElementRef;
    
    dateTimeRanger = [];
    current_state: string ="compare";
    protected modelData: any[];

    private period_data: any[];
    @Input()
    set model(optionValue: any[]) {
        this.modelData = optionValue;
        this.modelChange.emit(this.modelData);
    }

    @Output() modelChange = new EventEmitter();

    get model() {
        return this.modelData;
    }

    constructor(protected service: SaleReportService, protected formValidation: FormValidationService) {
        if (typeof  this.period_data == "undefined") {
            this.period_data                  = [];
            this.period_data['compare_value'] = this.service.viewDataFilter['compare_value'];
            this.period_data['compare_type']  = this.service.viewDataFilter['compare_type'];
            this.period_data['compare_count'] = this.service.viewDataFilter['compare_count'];
            this.period_data['dateStart']     = this.service.viewDataFilter['dateStart'];
            this.period_data['dateEnd']       = this.service.viewDataFilter['dateEnd'];
        }
    }

    ngAfterViewInit(): void {
        if (this.dateRangerr)
            if (!this.dateTimeRanger.hasOwnProperty('startDate') && !this.dateTimeRanger.hasOwnProperty('endDate')) {
                this.dateTimeRanger['startDate'] = moment().subtract(1, 'week').format("MM/DD/YYYY");
                this.dateTimeRanger['endDate']   = moment().format("MM/DD/YYYY");
            }
            jQuery(this.dateRangerr.nativeElement).daterangepicker({
                                                                       "autoApply": true,
                                                                       "startDate": this.dateTimeRanger['startDate'],
                                                                       "endDate": this.dateTimeRanger['endDate'],
                                                                       "isConnectReport": true,
                                                                       "opens": "center",
                                                                       "timePicker": false,
                                                                       // applyClass: "tab-content",
                                                                       parentEl: "div[id='dateRangerTable']",
                                                                   }, (start, end, label)=> {
                if (this.current_state == 'ranger') {
                    this.dateTimeRanger['startDate'] = start.format("MM/DD/YYYY");
                    this.dateTimeRanger['endDate']   = end.format("MM/DD/YYYY");
                    this.model['dateStart']          = start.format('YYYY-MM-DD 00:00:00');
                    this.model['dateEnd']            = end.format('YYYY-MM-DD 23:59:59');
                }
            });
        $('input[id="dateRangerr"]').click();
    }

    @HostListener('document:click', ['$event.target'])
    onClick(target) {
        if (target.className.indexOf('txt-date-range') > -1) {
            this.model['openDateFilter'] = !this.model['openDateFilter'];
        } else if (this.noteElem && !this.noteElem.nativeElement.contains(target)) {
            if (target.className.indexOf('next available') > -1 || target.className.indexOf('prev available') > -1
                || target.className.indexOf('fa fa-chevron-left glyphicon glyphicon-chevron-left') >-1
                || target.className.indexOf('fa fa-chevron-right glyphicon glyphicon-chevron-right') >-1) {
                this.model['openDateFilter'] = true;
            } else {
                this.model['openDateFilter'] = false;
            }
        }
    }

    convertDisplay(data) {
        if (this.current_state == "compare") {
            if (this.period_data['compare_value'] == "hour") {
                return moment(data).format('llll');
            } else {
                return moment(data).format('MMM DD, YYYY');
            }
        }
        return moment(data).format('MMM DD, YYYY');
    }

    convertCurrentDateDisplay(data) {
        if (this.current_state == "compare") {
            if (this.model['compare_value'] == "hour") {
                return moment(data).format('llll');
            } else {
              return moment(data).format('MMM DD, YYYY');
            }
        }
      return moment(data).format('MMM DD, YYYY');
    }

    checkData() {
        if (moment(this.model['dateStart']).isValid() == false || moment(this.model['dateStart']).isValid() == false) {
            return false;
        }
        return true;
    }

    getSaleReport(type:string) {
        if (type == "compare") {
            this.model['compare_value'] = this.period_data['compare_value'];
            this.model['compare_type']  = this.period_data['compare_type'];
            this.model['compare_count'] = this.period_data['compare_count'];
            this.model['dateStart']     = this.period_data['dateStart'];
            this.model['dateEnd']       = this.period_data['dateEnd'];
        }
      if (type == "ranger") {
        this.model['dateStart'] = moment(this.dateTimeRanger['startDate']).format('YYYY-MM-DD 00:00:00');
        this.model['dateEnd']   = moment(this.dateTimeRanger['endDate']).format('YYYY-MM-DD 23:59:59');
      }
        if (this.model['compare_type'] && (this.model['compare_type'] == 'last' || this.model['compare_type'] == 'last_from')){
          this.formValidation.submit('date-compare-item', async () => {
            if (moment(this.model['dateStart']).isValid() == false || moment(this.model['dateStart']).isValid() == false) {
              return;
            } else {
              this.model['dateTimeState'] = type;
              this.model['openDateFilter'] = false;
              this.service.getSaleReport();
            }
          }, true);
        } else
        if (moment(this.model['dateStart']).isValid() == false || moment(this.model['dateStart']).isValid() == false) {
            return;
        } else {
            this.model['dateTimeState'] = type;
            this.model['openDateFilter'] = false;
            this.service.getSaleReport();
        }
    }

}
