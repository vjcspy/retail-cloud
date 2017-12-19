import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'angular-meteor-datatable-select-field',
             templateUrl: 'select.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AngularMeteorDatatableSelectFieldComponent implements OnInit, AfterViewInit {
  @ViewChild('selectElem') selectElem: ElementRef;
  @Input() filterConfig: any;
  @Input() filterValue: any;
  @Output() filterValueChange: EventEmitter<any> = new EventEmitter();
  
  constructor() { }
  
  ngOnInit() { }
  
  ngAfterViewInit(): void {
    const vm = this;
    jQuery(this.selectElem.nativeElement)['select2']().on('change', function (e) {
      vm.filterValueChange.emit(jQuery(this).val());
    });
  }
}
