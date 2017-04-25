import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import * as moment from 'moment';

@Component({
             selector: 'j-week-picker',
             templateUrl: 'week-picker.component.html',
             styleUrls: ['week-picker.component.scss']
           })
export class WeekPickerComponent implements OnInit, AfterViewInit {
  private _start_date: any = moment().startOf('week').toDate();
  private _end_date: any   = moment().startOf('week').toDate();
  protected _displayPicker = true;
  
  @Output('startDate') startDate = new EventEmitter();
  @Output('endDate') endDate     = new EventEmitter();
  @ViewChild('valueLabel') valueLabel: ElementRef;
  
  constructor() { }
  
  ngOnInit() { }
  
  private _initWeekPicker() {
    const weekPickerElem    = jQuery('.week-picker');
    const selectCurrentWeek = function () {
      setTimeout(() => {
        weekPickerElem.find('.ui-datepicker-current-day a').addClass('ui-state-active');
      }, 200);
    };
    const vm                = this;
    weekPickerElem.datepicker({
                                showOtherMonths: true,
                                selectOtherMonths: true,
                                onSelect: function (dateText, inst) {
                                  let date            = jQuery(this)['datepicker']('getDate');
                                  vm._start_date      =
                                    new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
                                  vm._end_date        =
                                    new Date(date.getFullYear(),
                                             date.getMonth(),
                                             date.getDate() - date.getDay() + 6);
                                  let momentStartDate = moment(vm._start_date);
                                  let momentEndDate   = moment(vm._end_date);
                                  vm.startDate.emit(momentStartDate);
                                  vm.endDate.emit(momentEndDate);
                                  vm.valueLabel.nativeElement.setAttribute('value',
                                                                           momentStartDate.format('YYYY/MM/DD') + '-' + momentEndDate.format(
                                                                             'YYYY/MM/DD'));
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
    // trigger select current week
    jQuery('.ui-datepicker-current-day').click();
    this.togglePicker();
  }
  
  ngAfterViewInit(): void {
    this._initWeekPicker();
  }
  
  togglePicker() {
    this._displayPicker = !this._displayPicker;
    if (this._displayPicker) {
      jQuery('.week-picker').show();
    } else {
      jQuery('.week-picker').hide();
    }
  }
}
