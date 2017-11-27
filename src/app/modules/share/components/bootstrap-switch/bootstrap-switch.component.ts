import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'iz-bootstrap-switch',
             templateUrl: 'bootstrap-switch.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class IZBootstrapSwitchComponent implements OnInit, AfterViewInit {
  @ViewChild('bootstrapSwitchElem') protected bootstrapSwitchElem: ElementRef;
  @Input() protected model: boolean;
  @Output() protected modelChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input('state') protected state;
  
  constructor() { }
  
  ngOnInit() { }
  
  ngAfterViewInit(): void {
    let vm = this;
    $(this.bootstrapSwitchElem.nativeElement)['bootstrapSwitch']({
                                                                   offText: "No",
                                                                   onText: "Yes",
                                                                   state: !!this.state,
                                                                   onSwitchChange: (event, state) => {
                                                                     vm.model = state;
                                                                     vm.modelChange.emit(state);
                                                                   }
                                                                 });
  }
  
  
}
