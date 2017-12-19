import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'angular-meteor-datatable-text-filter',
             templateUrl: 'text.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })

export class AngularMeteorDatatableTextFilterComponent implements OnInit {
  @Input() filterConfig: any;
  @Input() filterValue: any;
  @Output() filterValueChange: EventEmitter<any> = new EventEmitter();
  
  constructor() { }
  
  ngOnInit() {
  }
}
