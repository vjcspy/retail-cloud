import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
             selector: 'j-week-picker',
             templateUrl: 'week-picker.component.html'
           })
export class WeekPickerComponent implements OnInit, AfterViewInit {
  private _start_date: any;
  private _end_date: any;
  
  @Output('startDate') startDate = new EventEmitter();
  @Output('endDate') endDate     = new EventEmitter();
  
  
  constructor() { }
  
  ngOnInit() { }
  
  private _initWeekPicker() {
    const selectCurrentWeek = function () {
      window.setTimeout(function () {
        jQuery('.week-picker').find('.ui-datepicker-current-day a').addClass('ui-state-active')
      }, 1);
    };
    const vm                = this;
    jQuery('.week-picker').datepicker({
                                        showOtherMonths: true,
                                        selectOtherMonths: true,
                                        onSelect: function (dateText, inst) {
                                          let date       = jQuery(this)['datepicker']('getDate');
                                          vm._start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
                                          vm._end_date   = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 6);
                                          vm.startDate.emit(moment(vm._start_date));
                                          vm.endDate.emit(moment(vm._end_date));
                                          selectCurrentWeek();
                                        },
                                        beforeShowDay: function (date) {
                                          let cssClass = '';
                                          if (date >= vm._start_date && date <= vm._end_date)
                                            cssClass = 'ui-datepicker-current-day';
                                          return [true, cssClass];
                                        },
                                        onChangeMonthYear: function (year, month, inst) {
                                          selectCurrentWeek();
                                        }
                                      });
  }
  
  ngAfterViewInit(): void {
    this._initWeekPicker();
  }
  
}
